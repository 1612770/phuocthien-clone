import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { NextPageWithLayout } from './page';
import {
  AutoComplete,
  Breadcrumb,
  Button,
  Col,
  Divider,
  Empty,
  Input,
  Radio,
  Row,
  Typography,
} from 'antd';
import { ChevronLeft } from 'react-feather';
import CartProductItem from '@modules/cart/CartProductItem';
import { useCart } from '@providers/CartProvider';
import Link from 'next/link';

const CartPage: NextPageWithLayout = () => {
  const { cartProducts } = useCart();

  const totalPrice = cartProducts.reduce(
    (total, cartProduct) =>
      total + (cartProduct.product.retailPrice || 0) * cartProduct.quantity,
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
        <>
          <div className="md:border-1 border-none px-4 py-0 shadow-none md:rounded-lg md:border-solid md:border-gray-200 md:py-4 md:shadow-lg">
            {cartProducts.map((cartProduct) => (
              <CartProductItem
                key={cartProduct.product.key}
                cartProduct={cartProduct}
              />
            ))}

            <div className="mt-4 flex justify-between">
              <Typography.Text>
                Tạm tính ({cartProducts.length} sản phẩm):
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
            <Radio.Group>
              <Radio value={1}>Anh</Radio>
              <Radio value={2}>Chị</Radio>
            </Radio.Group>
            <Row className="mt-2" gutter={[8, 8]}>
              <Col xs={24} md={12}>
                <Input placeholder="Họ và tên" />
              </Col>
              <Col xs={24} md={12}>
                <Input placeholder="Số điện thoại" />
              </Col>
            </Row>

            <Divider />
            <Typography.Title level={4}>
              Chọn cách thức nhận hàng
            </Typography.Title>
            <Radio.Group>
              <Radio value={1}>Giao tận nơi</Radio>
              <Radio value={2}>Nhận tại nhà thuốc</Radio>
            </Radio.Group>

            <div className="my-4 rounded-lg bg-gray-200 p-4">
              <Typography className="text-xs">
                Chọn địa chỉ để biết thời gian nhận hàng và phí vận chuyển (nếu
                có)
              </Typography>
              <Row className="my-2" gutter={[8, 8]}>
                <Col xs={24} md={12}>
                  <AutoComplete
                    className="w-full"
                    placeholder="Nhập tỉnh/thành"
                  />
                </Col>
                <Col xs={24} md={12}>
                  <AutoComplete
                    className="w-full"
                    placeholder="Nhập huyện/quận"
                  />
                </Col>
                <Col xs={24} md={12}>
                  <AutoComplete
                    className="w-full"
                    placeholder="Nhập xã/phường"
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Input placeholder="Nhập địa chỉ" />
                </Col>
              </Row>
            </div>

            <Input.TextArea
              rows={4}
              placeholder="Nhập ghi chú (nếu có)"
              className="mt-2"
            />
          </div>

          <Typography className="my-4 text-center text-xs text-gray-500">
            Bằng cách đặt hàng, bạn đồng ý với Điều khoản sử dụng của Nhà thuốc
            Phước Thiện
          </Typography>
        </>
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
