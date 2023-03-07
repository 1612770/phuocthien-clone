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
  Modal,
  Radio,
  Row,
  Typography,
} from 'antd';
import { ChevronLeft, MapPin } from 'react-feather';
import CartProductItem from '@modules/cart/CartProductItem';
import { useCart } from '@providers/CartProvider';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import PaymentMethodModel from '@configs/models/payment-method.model';
import { GeneralClient } from '@libs/client/General';
import { Fragment, useEffect, useState } from 'react';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ShippingTypes from '@configs/enums/shipping-types.enum';
import DrugStorePicker from '@modules/cart/DrugStorePicker';
import CheckoutProvider, { useCheckout } from '@providers/CheckoutProvider';
import AddressInput from '@modules/cart/AddressInput';
import ImageUtils from '@libs/utils/image.utils';
import { REGEX_PHONE } from '@configs/env';
import { OfferClient } from '@libs/client/Offer';
import OfferModel from '@configs/models/offer.model';
import OfferCodeInput from '@modules/cart/OfferCodeInput';
import { MasterDataClient } from '@libs/client/MasterData';
import ProvinceModel from '@configs/models/province.model';
import MasterDataProvider, {
  useMasterData,
} from '@providers/MasterDataProvider';
import { AuthClient } from '@libs/client/Auth';
import AddressModel from '@configs/models/address.model';
import AddressesProvider, { useAddresses } from '@providers/AddressesProvider';
import { useAuth } from '@providers/AuthProvider';
import { useAppMessage } from '@providers/AppMessageProvider';
import Addresses from '@modules/address/Addresses';

function AddressSection() {
  const [openModal, setOpenModal] = useState(false);

  const {
    address,
    setAddress,
    currentProvinceKey,
    setCurrentProvinceKey,
    currentDistrictKey,
    setCurrentDistrictKey,
    currentWardKey,
    setCurrentWardKey,
  } = useCheckout();

  const { isUserLoggedIn } = useAuth();
  const { defaultAddress } = useAddresses();
  const { loadWards, loadDistricts, provinces } = useMasterData();
  const { toastError } = useAppMessage();

  const setDefaultDistrict = async (
    defaultAddress: AddressModel,
    provinceCode: string
  ) => {
    try {
      const districts = await loadDistricts({ provinceCode });

      const foundDistrict = districts?.find(
        (district) => district.districtName === defaultAddress.districtName
      );
      setCurrentDistrictKey(foundDistrict?.districtCode || '');
      const wards = await loadWards({
        districtCode: foundDistrict?.districtCode || '',
      });
      const foundWard = wards?.find(
        (ward) => ward.wardName === defaultAddress.wardName
      );
      setCurrentWardKey(foundWard?.wardName || '');
    } catch (error) {
      toastError({
        data: error,
      });
    }
  };

  useEffect(() => {
    if (defaultAddress && isUserLoggedIn) {
      setAddress(defaultAddress.address || '');

      const foundProvince = provinces.find(
        (province) => province.provinceName === defaultAddress.provinceName
      );

      setCurrentProvinceKey(foundProvince?.provinceCode || '');

      setDefaultDistrict(defaultAddress, foundProvince?.provinceCode || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress, isUserLoggedIn]);

  return (
    <div className="my-4 rounded-lg bg-gray-50 p-4">
      <Typography.Text className="text-sm">
        Chọn địa chỉ để biết thời gian nhận hàng và phí vận chuyển (nếu có)
      </Typography.Text>
      {isUserLoggedIn && (
        <div>
          <Button
            type="link"
            className="my-0 px-0 "
            onClick={() => setOpenModal(true)}
            icon={<MapPin size={14} className=" mr-1 align-text-top" />}
          >
            Chọn địa chỉ từ sổ địa chỉ
          </Button>

          <Modal
            title={
              <Typography className="text-base font-medium">
                Sổ địa chỉ
              </Typography>
            }
            open={openModal}
            onCancel={() => setOpenModal(false)}
            footer={null}
          >
            <div className="max-h-[400px] overflow-y-auto">
              <Addresses
                pickOnly
                onAddressSelect={(address) => {
                  setAddress(address.address || '');
                  const foundProvince = provinces.find(
                    (province) => province.provinceName === address.provinceName
                  );

                  setCurrentProvinceKey(foundProvince?.provinceCode || '');

                  setDefaultDistrict(
                    address,
                    foundProvince?.provinceCode || ''
                  );
                  setOpenModal(false);
                }}
              />
            </div>
          </Modal>
        </div>
      )}
      <AddressInput
        address={address}
        setAddress={setAddress}
        currentProvinceKey={currentProvinceKey}
        setCurrentProvinceKey={setCurrentProvinceKey}
        currentDistrictKey={currentDistrictKey}
        setCurrentDistrictKey={setCurrentDistrictKey}
        currentWardKey={currentWardKey}
        setCurrentWardKey={setCurrentWardKey}
      />
    </div>
  );
}

const CartPage: NextPageWithLayout<{
  paymentMethods: PaymentMethodModel[];
  offers: OfferModel[];
}> = ({ paymentMethods, offers }) => {
  const { cartProducts } = useCart();
  const {
    name,
    setName,

    tel,
    setTel,

    shippingType,
    setShippingType,

    currentDrugStoreKey,
    setCurrentDrugStoreKey,

    setPaymentMethodKey,

    checkoutError,
    setCheckoutError,
    checkingOut,
    checkout,

    totalRawPrice,
    totalPrice,
  } = useCheckout();

  const { form } = useMasterData();

  const [checkoutForm] = Form.useForm();

  const totalProducts = cartProducts.reduce(
    (total, cartProduct) => total + (Number(cartProduct.quantity) || 0),
    0
  );

  const onCheckoutButtonClick = async () => {
    try {
      await Promise.all([
        checkoutForm.validateFields(),
        form?.validateFields(),
      ]);

      checkout();
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
        <Form onFinish={() => undefined} scrollToFirstError form={checkoutForm}>
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

            <Divider />
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
                  <Input
                    placeholder="Họ và tên (bắt buộc)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
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
                  <Input
                    placeholder="Số điện thoại (bắt buộc)"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider className="mt-0" />
            <Typography.Title level={4}>
              Chọn cách thức nhận hàng
            </Typography.Title>
            <Radio.Group value={shippingType}>
              <Radio.Button
                value={ShippingTypes.DELIVERY}
                onChange={(e) => setShippingType(e.target.value)}
              >
                Giao tận nơi
              </Radio.Button>
              <Radio.Button
                value={ShippingTypes.AT_STORE}
                onChange={(e) => setShippingType(e.target.value)}
              >
                Nhận tại nhà thuốc
              </Radio.Button>
            </Radio.Group>

            {shippingType === ShippingTypes.DELIVERY && <AddressSection />}

            {shippingType === ShippingTypes.AT_STORE && (
              <DrugStorePicker
                value={currentDrugStoreKey}
                onChange={(key) => {
                  setCurrentDrugStoreKey(key);
                }}
              />
            )}

            <Divider />
            <Typography.Title level={4}>
              Chọn phương thức thanh toán
            </Typography.Title>
            <Form.Item
              name="paymentMethod"
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
                    onChange={() => {
                      if (paymentMethod.key)
                        setPaymentMethodKey(paymentMethod.key);
                    }}
                    key={paymentMethod.key}
                    className="my-2 w-full"
                  >
                    <div className="flex items-center">
                      <ImageWithFallback
                        src={paymentMethod.image || ''}
                        width={40}
                        height={40}
                        layout="fixed"
                        getMockImage={() =>
                          ImageUtils.getRandomMockCheckoutUrl()
                        }
                      />
                      <div className="ml-4">
                        <Typography className="font-medium">
                          {paymentMethod.name}
                        </Typography>
                        <Typography>{paymentMethod.description}</Typography>
                      </div>
                    </div>
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            <Divider />

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
    <PrimaryLayout hideFooter>
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

  const generalClient = new GeneralClient(context, {});
  const authClient = new AuthClient(context, {});
  const offerClient = new OfferClient(context, {});
  const masterDataClient = new MasterDataClient(context, {});

  try {
    const [paymentMethods, offers, provinces, addresses] = await Promise.all([
      generalClient.getPaymentMethods(),
      offerClient.getAllActiveOffers(),
      masterDataClient.getAllProvinces(),
      authClient.getAddresses(),
    ]);

    if (offers.data) {
      serverSideProps.props.offers = offers.data;
    }

    if (provinces.data) {
      serverSideProps.props.provinces = provinces.data;
    }

    if (addresses.data) {
      serverSideProps.props.addresses = addresses.data;
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
