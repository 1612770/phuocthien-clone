import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
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
import AddressInput from '@modules/cart/AddressInput';

const CartPage: NextPageWithLayout<{
  paymentMethods: PaymentMethodModel[];
}> = ({ paymentMethods }) => {
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

    checkingOut,

    checkout,
  } = useCheckout();

  const totalPrice = cartProducts.reduce(
    (total, cartProduct) =>
      total + (cartProduct.product.retailPrice || 0) * cartProduct.quantity,
    0
  );

  const totalProducts = cartProducts.reduce(
    (total, cartProduct) => total + (Number(cartProduct.quantity) || 0),
    0
  );

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
        <Form onFinish={checkout} scrollToFirstError>
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
                {totalPrice.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography.Text>
            </div>

            <Divider />
            <Typography.Title level={4}>Thông tin khách hàng</Typography.Title>

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
                      pattern: new RegExp(process.env.NEXT_PUBLIC_REGEX_PHONE),
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
              <Radio
                value={ShippingTypes.DELIVERY}
                onChange={(e) => setShippingType(e.target.value)}
              >
                Giao tận nơi
              </Radio>
              <Radio
                value={ShippingTypes.AT_STORE}
                onChange={(e) => setShippingType(e.target.value)}
              >
                Nhận tại nhà thuốc
              </Radio>
            </Radio.Group>

            {shippingType === ShippingTypes.DELIVERY && <AddressInput />}

            {shippingType === ShippingTypes.AT_STORE && (
              <DrugStorePicker
                value={currentDrugStoreKey}
                onChange={(key) => {
                  setCurrentDrugStoreKey(key);
                }}
              />
            )}

            <Input.TextArea
              rows={2}
              placeholder="Nhập ghi chú (nếu có)"
              className="mt-2"
            />

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
                        getMockImage={() => '/mock/checkout.png'}
                      />
                      <div className="ml-2">
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
            <div className="flex items-center justify-between gap-4">
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

            <Button
              type="primary"
              htmlType="submit"
              loading={checkingOut}
              size="large"
              block
              className="mt-2 h-[52px] bg-primary-light font-bold shadow-none"
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
      <CheckoutProvider>{page}</CheckoutProvider>
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
    };
  } = {
    props: {
      paymentMethods: [],
    },
  };

  const general = new GeneralClient(context, {});
  const paymentMethods = await general.getPaymentMethods();

  serverSideProps.props.paymentMethods =
    paymentMethods.data?.filter(
      (method) =>
        (typeof method.visible === 'boolean' && method.visible) ||
        typeof method.visible === 'undefined'
    ) || [];

  return serverSideProps;
};
