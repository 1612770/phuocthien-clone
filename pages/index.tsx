import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import ProductCard from 'components/templates/ProductCard';
import { NextPageWithLayout } from './page';
import { Button, Col, Row, Space, Typography } from 'antd';
import HomepageCarousel from 'modules/homepage/HomepageCarousel';
import { ChevronRight } from 'react-feather';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <img
        className="block h-[50vh] w-full object-cover"
        src="https://cdn.tgdd.vn/2022/12/banner/Big-banner-desktop-1920x450-5.webp"
        alt="carousel image"
      />

      <div className="container -mt-20">
        <HomepageCarousel />
      </div>
      <div className="pl-2 lg:container lg:pl-0">
        <Typography.Title
          level={3}
          className="mb-0 mt-6 uppercase lg:mb-4 lg:mt-12"
        >
          Sản phẩm bán chạy
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
        </div>
      </div>

      <img
        className="mt-8 mb-2 block aspect-video max-h-[240px] w-full object-cover"
        src="https://phuocthien.vn/Images/ImageUpload/2022-11/TOCDE.png"
        alt="banner image"
      />
      <div className="lg:container">
        <div className="flex overflow-auto px-2 pb-2 lg:justify-center">
          <Space size={[16, 8]} wrap className="justify-center">
            <Button size="large" className="border-none bg-gray-100">
              Nổi bật
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Giảm đau, hạ sốt
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Thuốc ho
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Mắt, tai, mũi, họng
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Mắt, tai, mũi, họng
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Mắt, tai, mũi, họng
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Mắt, tai, mũi, họng
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Mắt, tai, mũi, họng
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Mắt, tai, mũi, họng
            </Button>
          </Space>
        </div>

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
        </div>

        <div className="mt-2 flex justify-center">
          <Button size="large" className="w-1/2 border-primary text-primary">
            Xem tất cả thuốc
            <ChevronRight size={16} className="align-middle" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
