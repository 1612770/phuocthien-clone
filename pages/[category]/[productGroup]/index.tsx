import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { Breadcrumb, Col, Row, Space, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import ProductChildGroup from '@modules/products/ProductChildGroup';
import ProductCard from '@components/templates/ProductCard';

const ProductGroupPage: NextPageWithLayout = () => {
  return (
    <div className="container pb-4">
      <Breadcrumb className="mt-4 mb-2">
        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item href="/duoc-my-pham">Dược, mỹ phẩm</Breadcrumb.Item>
        <Breadcrumb.Item>Cơ xương khớp, gút</Breadcrumb.Item>
      </Breadcrumb>

      <Space size={[8, 8]} wrap>
        <ProductChildGroup />
        <ProductChildGroup />
        <ProductChildGroup />
        <ProductChildGroup />
        <ProductChildGroup />
        <ProductChildGroup />
        <ProductChildGroup />
      </Space>

      <div className="pl-2 lg:container lg:pl-0">
        <Typography.Title level={4} className="mb-0 mt-4 uppercase lg:mb-4">
          Sản phẩm nổi bật
        </Typography.Title>
      </div>
      <div className="lg:container">
        <Row gutter={16} className="hidden lg:flex">
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Hỗn dịch uống Phosphalugel 20% trị trào ngược dạ dày, thực quản" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Khẩu trang y tế Khánh An 4 lớp màu trắng" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Nước muối Safin giúp sát khuẩn, súc miệng" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Cao dán Salonpas giảm đau, kháng viêm" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Hỗn dịch uống Phosphalugel 20% trị trào ngược dạ dày, thực quản" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Khẩu trang y tế Khánh An 4 lớp màu trắng" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Nước muối Safin giúp sát khuẩn, súc miệng" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Cao dán Salonpas giảm đau, kháng viêm" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Hỗn dịch uống Phosphalugel 20% trị trào ngược dạ dày, thực quản" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Khẩu trang y tế Khánh An 4 lớp màu trắng" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Nước muối Safin giúp sát khuẩn, súc miệng" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Cao dán Salonpas giảm đau, kháng viêm" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Hỗn dịch uống Phosphalugel 20% trị trào ngược dạ dày, thực quản" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Khẩu trang y tế Khánh An 4 lớp màu trắng" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Nước muối Safin giúp sát khuẩn, súc miệng" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Cao dán Salonpas giảm đau, kháng viêm" />
          </Col>
        </Row>
        <div className="-mx-2 flex w-full overflow-auto pl-2 lg:hidden">
          <ProductCard
            title="Hỗn dịch uống Phosphalugel 20% trị trào ngược dạ dày, thực quản"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Khẩu trang y tế Khánh An 4 lớp màu trắng"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Nước muối Safin giúp sát khuẩn, súc miệng"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Cao dán Salonpas giảm đau, kháng viêm"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Hỗn dịch uống Phosphalugel 20% trị trào ngược dạ dày, thực quản"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Khẩu trang y tế Khánh An 4 lớp màu trắng"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Nước muối Safin giúp sát khuẩn, súc miệng"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Cao dán Salonpas giảm đau, kháng viêm"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Hỗn dịch uống Phosphalugel 20% trị trào ngược dạ dày, thực quản"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Khẩu trang y tế Khánh An 4 lớp màu trắng"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Nước muối Safin giúp sát khuẩn, súc miệng"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Cao dán Salonpas giảm đau, kháng viêm"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductGroupPage;

ProductGroupPage.getLayout = (page) => {
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};
