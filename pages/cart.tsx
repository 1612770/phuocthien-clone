import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { NextPageWithLayout } from './page';
import {
  AutoComplete,
  Breadcrumb,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Input,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd';
import { ChevronLeft, Minus, Plus, X } from 'react-feather';
import Link from 'next/link';

function CartProductItem() {
  return (
    <div className="my-8 flex justify-between ">
      <div className="flex  flex-col">
        <img
          src="https://cdn.tgdd.vn/Products/Images/10253/285132/hon-dich-men-vi-sinh-livespo-colon-ho-tro-dieu-tri-viem-dai-trang-thumb-1-1-200x200.jpg"
          alt="product image"
          className="aspect-square w-[80px]"
        />
        <Button
          size="small"
          type="ghost"
          icon={<X size={16} className="mb-[2px] align-middle" />}
          className="mt-2 bg-gray-200 p-0"
        >
          Xóa
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-1 basis-[300px] flex-col">
          <Typography.Text>
            Men vi sinh LiveSpo Colon hỗ trợ điều trị viêm đại tràng
          </Typography.Text>

          <Collapse
            defaultActiveKey={['1']}
            ghost
            className="product-cart-item-collapse"
          >
            <Collapse.Panel header="2 khuyến mãi" key="1" className="p-0">
              <Typography className="text-xs">
                Cơ hội trúng 10 Iphone 14 Pro Max 128GB màu ngẫu nhiên cho đơn
                hàng từ 100.000đ (16/12/2022 - 15/01/2023){' '}
                <Link href="">
                  <a>(Click để xem chi tiết)</a>
                </Link>
              </Typography>

              <Typography className="text-xs">
                Cơ hội trúng 10 Iphone 14 Pro Max 128GB màu ngẫu nhiên cho đơn
                hàng từ 100.000đ (16/12/2022 - 15/01/2023)
                <Link href="">
                  <a>(Click để xem chi tiết)</a>
                </Link>
              </Typography>
            </Collapse.Panel>
          </Collapse>
        </div>
        <div className="meta flex flex-col">
          <Typography.Text className="text-right">
            <Typography.Text className="text-sm font-semibold">
              20.000
              <sup className="text-xs">đ</sup>
            </Typography.Text>
            <Typography.Text className="text-sm">/vỉ</Typography.Text>
          </Typography.Text>

          <Space size={4} className="mt-1">
            <Button icon={<Minus size={20} />}></Button>
            <Input className="w-[40px]" value={1}></Input>
            <Button icon={<Plus size={20} />}></Button>
          </Space>
        </div>
      </div>
    </div>
  );
}

const CartPage: NextPageWithLayout = () => {
  return (
    <div className="container max-w-[720px] pb-4">
      <Breadcrumb className="mt-4 mb-2">
        <Breadcrumb.Item href="/">
          <div className="flex items-center">
            <ChevronLeft size={20} />
            <span>Mua thêm sản phẩm khác</span>
          </div>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card className="md:border-1 sm:border-none sm:shadow-none md:rounded-lg md:shadow-lg">
        <CartProductItem />
        <CartProductItem />

        <div className="mt-4 flex justify-between">
          <Typography.Text>Tạm tính (1 sản phẩm):</Typography.Text>
          <Typography.Text className="font-bold text-primary-light">
            40.000đ
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
        <Typography.Title level={4}>Chọn cách thức nhận hàng</Typography.Title>
        <Radio.Group>
          <Radio value={1}>Giao tận nơi</Radio>
          <Radio value={2}>Nhận tại nhà thuốc</Radio>
        </Radio.Group>

        <div className="my-4 rounded-lg bg-gray-200 p-4">
          <Typography className="text-xs">
            Chọn địa chỉ để biết thời gian nhận hàng và phí vận chuyển (nếu có)
          </Typography>
          <Row className="my-2" gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <AutoComplete className="w-full" placeholder="Nhập tỉnh/thành" />
            </Col>
            <Col xs={24} md={12}>
              <AutoComplete className="w-full" placeholder="Nhập huyện/quận" />
            </Col>
            <Col xs={24} md={12}>
              <AutoComplete className="w-full" placeholder="Nhập xã/phường" />
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
      </Card>

      <Typography className="my-4 text-center text-xs text-gray-500">
        Bằng cách đặt hàng, bạn đồng ý với Điều khoản sử dụng của Nhà thuốc An
        khang
      </Typography>
    </div>
  );
};

export default CartPage;

CartPage.getLayout = (page) => {
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};
