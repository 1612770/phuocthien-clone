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
  Select,
  Typography,
} from 'antd';
import { ChevronLeft } from 'react-feather';
import CartProductItem from '@modules/cart/CartProductItem';
import { useCart } from '@providers/CartProvider';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import PaymentMethodModel from '@configs/models/payment-method.model';
import { GeneralClient } from '@libs/client/General';
import { Fragment, useMemo, useState } from 'react';
import { convertStringToASCII, getErrorMessage } from '@libs/helpers';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ShippingTypes from '@configs/enums/shipping-types.enum';
import DrugStorePicker from '@modules/cart/DrugStorePicker';
import { ProductClient } from '@libs/client/Product';
import { OrderClient } from '@libs/client/Order';
import { useRouter } from 'next/router';

const provincesOfVietNamJSON: {
  [key: string]: {
    name: string;
    'quan-huyen': {
      [key: string]: {
        name: string;
        'xa-phuong': {
          [key: string]: {
            name: string;
          };
        };
      };
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('../public/assets/vn.json');

const CartPage: NextPageWithLayout<{
  paymentMethods: PaymentMethodModel[];
}> = ({ paymentMethods }) => {
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');

  const router = useRouter();

  const [paymentMethodKey, setPaymentMethodKey] = useState('');
  const [shippingType, setShippingType] = useState<ShippingTypes>(
    ShippingTypes.DELIVERY
  );

  const [currentProvinceKey, setCurrentProvinceKey] = useState<string | null>(
    null
  );
  const [currentDistrictKey, setCurrentDistrictKey] = useState<string | null>(
    null
  );
  const [currentWardKey, setCurrentWardKey] = useState<string | null>();

  const [address, setAddress] = useState('');
  const [currentDrugStoreKey, setCurrentDrugStoreKey] = useState('');

  const currentProvince = useMemo(() => {
    if (!currentProvinceKey) {
      return undefined;
    }

    return provincesOfVietNamJSON[currentProvinceKey];
  }, [currentProvinceKey]);

  const currentDistrict = useMemo(() => {
    if (!currentDistrictKey) {
      return undefined;
    }
    return currentProvince?.['quan-huyen'][currentDistrictKey];
  }, [currentDistrictKey, currentProvince]);

  const [checkoutError, setCheckoutError] = useState('');

  const { cartProducts } = useCart();

  const totalPrice = cartProducts.reduce(
    (total, cartProduct) =>
      total + (cartProduct.product.retailPrice || 0) * cartProduct.quantity,
    0
  );

  const checkout = async () => {
    try {
      if (!(totalPrice > 10000)) {
        throw new Error('Giá trị đơn hàng phải lớn hơn 10.000đ');
      }

      const order = new OrderClient(null, {});
      const orderResponse = await order.order({
        customerInfo: {
          name,
          tel,
        },
        paymentMethodKey,
        shippingType,
        drugstoreKey:
          shippingType === ShippingTypes.AT_STORE
            ? currentDrugStoreKey
            : undefined,
        deliveryAddressInfo:
          shippingType === ShippingTypes.DELIVERY
            ? {
                province: currentProvince?.name || '',
                district: currentDistrict?.name || '',
                ward:
                  (currentWardKey &&
                    currentDistrict?.['xa-phuong'][currentWardKey].name) ||
                  '',
                detail: address,
              }
            : undefined,
        items: cartProducts.map((cartProduct) => ({
          productKey: cartProduct.product.key || '',
          quantity: cartProduct.quantity || 0,
          note: cartProduct.note || '',
        })),
      });

      router.push(`/don-hang/${orderResponse.data?.key}`);
    } catch (error) {
      router.push(`/don-hang/123`);
      setCheckoutError(getErrorMessage(error));
    }
  };

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
                  className="w-full"
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
                  className="w-full"
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

            {shippingType === ShippingTypes.DELIVERY && (
              <div className="my-4 rounded-lg bg-gray-50 p-4">
                <Typography.Text className="text-sm">
                  Chọn địa chỉ để biết thời gian nhận hàng và phí vận chuyển
                  (nếu có)
                </Typography.Text>

                <Row className="my-2" gutter={[8, 8]}>
                  <Col xs={24} md={12}>
                    <Select
                      showSearch
                      className="w-full"
                      placeholder="Nhập tỉnh/thành phố"
                      allowClear
                      value={currentProvinceKey}
                      onChange={(value) => {
                        setCurrentProvinceKey(value);
                        setCurrentDistrictKey(null);
                        setCurrentWardKey(null);
                      }}
                      filterOption={(inputValue, currentOption) => {
                        const option =
                          provincesOfVietNamJSON[currentOption?.key];

                        return (
                          convertStringToASCII(
                            option?.name.toLowerCase()
                          ).indexOf(
                            convertStringToASCII(inputValue.toLowerCase())
                          ) !== -1
                        );
                      }}
                    >
                      {Object.entries(provincesOfVietNamJSON).map(
                        ([key, province]) => {
                          return (
                            <Select.Option key={key} value={key}>
                              {province.name}
                            </Select.Option>
                          );
                        }
                      )}
                    </Select>
                  </Col>
                  <Col xs={24} md={12}>
                    <Select
                      showSearch
                      className="w-full"
                      disabled={!currentProvinceKey}
                      value={currentDistrictKey}
                      placeholder="Nhập huyện/quận"
                      onChange={(value) => {
                        setCurrentDistrictKey(value);
                        setCurrentWardKey(null);
                      }}
                      filterOption={(inputValue, currentOption) => {
                        if (!currentProvinceKey) return false;

                        const option =
                          provincesOfVietNamJSON[currentProvinceKey][
                            'quan-huyen'
                          ][currentOption?.key];

                        return (
                          convertStringToASCII(
                            option?.name.toLowerCase()
                          ).indexOf(
                            convertStringToASCII(inputValue.toLowerCase())
                          ) !== -1
                        );
                      }}
                    >
                      {currentProvinceKey &&
                        Object.entries(
                          currentProvince?.['quan-huyen'] || {}
                        ).map(([key, district]) => {
                          return (
                            <Select.Option key={key} value={key}>
                              {district.name}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Col>
                  <Col xs={24} md={12}>
                    <Select
                      showSearch
                      className="w-full"
                      disabled={!currentDistrictKey}
                      value={currentWardKey}
                      placeholder="Nhập xã/phường"
                      onChange={setCurrentWardKey}
                      filterOption={(inputValue, currentOption) => {
                        if (!currentProvinceKey) return false;

                        const option =
                          currentDistrict?.['xa-phuong'][currentOption?.key];

                        return (
                          convertStringToASCII(
                            (option?.name || '').toLowerCase()
                          ).indexOf(
                            convertStringToASCII(inputValue.toLowerCase())
                          ) !== -1
                        );
                      }}
                    >
                      {currentProvinceKey &&
                        Object.entries(
                          currentDistrict?.['xa-phuong'] || {}
                        ).map(([key, ward]) => {
                          return (
                            <Select.Option key={key} value={key}>
                              {ward.name}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      name="address"
                      className="w-full"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập địa chỉ',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập địa chỉ"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}

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
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
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
