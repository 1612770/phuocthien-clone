import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from './page';
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  Radio,
  Row,
  Typography,
} from 'antd';
import { ChevronLeft } from 'react-feather';
import CartProductItem from '@modules/cart/CartProductItem';
import { useCart } from '@providers/CartProvider';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import PaymentMethodModel from '@configs/models/payment-method.model';
import { GeneralClient } from '@libs/client/General';
import { Fragment } from 'react';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ShippingTypes from '@configs/enums/shipping-types.enum';
import DrugStorePicker from '@modules/cart/DrugStorePicker';
import CheckoutProvider, { useCheckout } from '@providers/CheckoutProvider';
import { REGEX_PHONE } from '@configs/env';
import { OfferClient } from '@libs/client/Offer';
import OfferModel from '@configs/models/offer.model';
import OfferCodeInput from '@modules/cart/OfferCodeInput';
import { MasterDataClient } from '@libs/client/MasterData';
import ProvinceModel from '@configs/models/province.model';
import MasterDataProvider from '@providers/MasterDataProvider';
import AddressesProvider from '@providers/AddressesProvider';
import AddressSection from '@modules/cart/AddressSection';
import AddressModel from '@configs/models/address.model';
import { AuthClient } from '@libs/client/Auth';
import { COOKIE_KEYS } from '@libs/helpers';
import OfferUtils from '@libs/utils/offer.utils';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';

const CartPage: NextPageWithLayout<{
  paymentMethods: PaymentMethodModel[];
  offers: OfferModel[];
}> = ({ paymentMethods, offers }) => {
  const { cartProducts } = useCart();
  const {
    checkoutError,
    setCheckoutError,
    checkingOut,
    checkout,

    totalRawPrice,
    totalPrice,

    checkoutForm,
  } = useCheckout();

  const { setConfirmData } = useAppConfirmDialog();

  const totalProducts = cartProducts.reduce(
    (total, cartProduct) => total + (Number(cartProduct.quantity) || 0),
    0
  );

  const onCheckoutButtonClick = async () => {
    try {
      await checkoutForm?.validateFields();
      setConfirmData({
        title: 'Xác nhận đặt hàng',
        content:
          'Bạn đã kiểm tra thông tin mua hàng của mình và xác nhận đặt hàng',
        onOk: checkout,
      });
    } catch (error) {
      setCheckoutError('Vui lòng kiểm tra lại thông tin');

      // scroll smoothly to the top of the page
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="container max-w-[720px] pb-4">
      <Breadcrumb className="mt-4 mb-2">
        <Breadcrumb.Item>
          <Link href="/">
            <a>
              <div className="flex items-center">
                <ChevronLeft size={20} />
                <span>Mua thêm sản phẩm khác</span>
              </div>
            </a>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      {cartProducts.length > 0 && (
        <Form
          onFinish={() => undefined}
          scrollToFirstError
          form={checkoutForm}
          initialValues={{
            shippingType: ShippingTypes.DELIVERY,
          }}
        >
          <div className="md:border-1 border-none px-4 py-0 shadow-none md:rounded-lg md:border-solid md:border-gray-200 md:py-4 md:shadow-lg">
            {cartProducts.map((cartProduct, index) => (
              <Fragment key={cartProduct.product.key}>
                <CartProductItem cartProduct={cartProduct} />
                {index !== cartProducts.length - 1 && (
                  <Divider className="my-2" />
                )}
              </Fragment>
            ))}

            <div className="mt-4 flex justify-between">
              <Typography.Text>
                Tạm tính ({totalProducts} sản phẩm):
              </Typography.Text>
              <Typography.Text className="font-bold text-primary-light">
                {totalRawPrice.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography.Text>
            </div>

            <Divider className="my-2" />
            <Typography.Title level={4}>Thông tin nhận hàng</Typography.Title>

            <Row className="mt-2" gutter={[8, 8]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  className="mb-0 w-full"
                  rules={[
                    {
                      required: true,
                      message: 'Tên không được để trống',
                    },
                  ]}
                >
                  <Input placeholder="Họ và tên (bắt buộc)" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="tel"
                  className="mb-0 w-full"
                  rules={[
                    {
                      required: true,
                      message: 'Số điện thoại không được để trống',
                    },
                    {
                      pattern: new RegExp(REGEX_PHONE),
                      message: 'Vui lòng kiểm tra lại số điện thoại',
                    },
                  ]}
                >
                  <Input placeholder="Số điện thoại (bắt buộc)" />
                </Form.Item>
              </Col>
            </Row>

            <Divider className="mt-4 mb-4" />
            <Typography.Title level={4}>
              Chọn cách thức nhận hàng
            </Typography.Title>
            <Form.Item name="shippingType" className="m-0">
              <Radio.Group>
                <Radio.Button value={ShippingTypes.DELIVERY}>
                  Giao tận nơi
                </Radio.Button>
                <Radio.Button value={ShippingTypes.AT_STORE}>
                  Nhận tại nhà thuốc
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.shippingType !== currentValues.shippingType
              }
              noStyle
            >
              {({ getFieldValue }) =>
                getFieldValue('shippingType') === ShippingTypes.DELIVERY ? (
                  <AddressSection />
                ) : getFieldValue('shippingType') === ShippingTypes.AT_STORE ? (
                  <DrugStorePicker />
                ) : null
              }
            </Form.Item>

            <Form.Item name="orderNote">
              <Input.TextArea
                rows={4}
                placeholder="Nhập ghi chú (nếu có)"
                className="mt-2"
              />
            </Form.Item>

            <Divider className="my-2" />

            <Typography.Title level={4}>
              Chọn phương thức thanh toán
            </Typography.Title>
            <Form.Item
              name="paymentMethodKey"
              className="w-full"
              rules={[
                {
                  required: true,
                  message: 'Hãy chọn một phương thức thanh toán',
                },
              ]}
            >
              <Radio.Group>
                {paymentMethods.map((paymentMethod) => (
                  <Radio
                    value={paymentMethod.key}
                    key={paymentMethod.key}
                    className="my-2 w-full"
                  >
                    <div className="flex items-center">
                      <div className="ml-2">
                        <ImageWithFallback
                          src={paymentMethod.image || ''}
                          width={28}
                          height={28}
                          layout="fixed"
                          objectFit="contain"
                        />
                      </div>
                      <div className="ml-4">
                        <Typography className="font-semibold">
                          {paymentMethod.name}
                        </Typography>
                        <Typography className=" text-sm text-gray-500">
                          {paymentMethod.description}
                        </Typography>
                      </div>
                    </div>
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            <Divider className="mb-4 mt-2" />

            <OfferCodeInput offers={offers} />

            <div className="mt-4 flex items-center justify-between gap-4">
              <Typography.Title className="m-0" level={4}>
                Tổng tiền
              </Typography.Title>

              <Typography.Title level={4} className="m-0 text-primary">
                {totalPrice.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography.Title>
            </div>

            {checkoutError && (
              <Typography className="mt-2 text-center text-base text-red-500">
                {checkoutError}
              </Typography>
            )}

            <Button hidden htmlType="submit" />
            <Button
              type="primary"
              onClick={onCheckoutButtonClick}
              loading={checkingOut}
              size="large"
              block
              className="mt-4 mb-2 h-[52px] bg-primary-light font-bold shadow-none"
            >
              ĐẶT HÀNG
            </Button>
          </div>

          <Typography className="my-4 text-center text-xs text-gray-500">
            Bằng cách đặt hàng, bạn đồng ý với Điều khoản sử dụng của Nhà thuốc
            Phước Thiện
          </Typography>
        </Form>
      )}

      {!cartProducts.length && (
        <Empty
          className="mt-8"
          description={<Typography>Giỏ hàng của bạn đang trống</Typography>}
        >
          <Link href="/">
            <a>
              <Button>Mua thêm sản phẩm</Button>
            </a>
          </Link>
        </Empty>
      )}
    </div>
  );
};

export default CartPage;

CartPage.getLayout = (page) => {
  return (
    <PrimaryLayout>
      <MasterDataProvider defaultProvinces={page.props.provinces}>
        <CheckoutProvider>
          <AddressesProvider defaultAddresses={page.props.addresses}>
            {page}
          </AddressesProvider>
        </CheckoutProvider>
      </MasterDataProvider>
    </PrimaryLayout>
  );
};

// get server side props
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
      paymentMethods: PaymentMethodModel[];
      offers: OfferModel[];
      provinces: ProvinceModel[];
      addresses: AddressModel[];
    };
  } = {
    props: {
      paymentMethods: [],
      offers: [],
      provinces: [],
      addresses: [],
    },
  };

  const { req } = context;
  const token = req.cookies[COOKIE_KEYS.TOKEN];

  const generalClient = new GeneralClient(context, {});
  const authClient = new AuthClient(context, {});
  const offerClient = new OfferClient(context, {});
  const masterDataClient = new MasterDataClient(context, {});

  try {
    const [paymentMethods, offers, provinces] = await Promise.all([
      generalClient.getPaymentMethods(),
      offerClient.getAllActiveOffers(),
      masterDataClient.getAllProvinces(),
    ]);

    if (offers.data) {
      serverSideProps.props.offers = OfferUtils.filterNonValueOffer(
        offers.data
      );
    }

    if (provinces.data) {
      serverSideProps.props.provinces = provinces.data;
    }

    if (token) {
      const addresses = await authClient.getAddresses();
      if (addresses.data) {
        serverSideProps.props.addresses = addresses.data;
      }
    }

    serverSideProps.props.paymentMethods =
      paymentMethods.data?.filter(
        (method) =>
          (typeof method.visible === 'boolean' && method.visible) ||
          typeof method.visible === 'undefined'
      ) || [];
  } catch (error) {
    console.error('Gio hang', error);
  }

  return serverSideProps;
};
