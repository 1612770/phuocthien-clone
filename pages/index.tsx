import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import ProductCard from 'components/templates/ProductCard';
import { NextPageWithLayout } from './page';
import SectionTitle from 'components/templates/SectionTitle';
import { Button, Col, Row, Space } from 'antd';
import HomepageCarousel from 'modules/homepage/HomepageCarousel';
import SectionBanner from 'components/templates/SectionBanner';
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

        <SectionTitle title="Sản phẩm bán chạy">
          <div className="px-0">
            <Row>
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
          </div>
        </SectionTitle>

        <SectionBanner src="https://phuocthien.vn/Images/ImageUpload/2022-11/TOCDE.png">
          <div className="mb-1 flex justify-center">
            <Space size={16}>
              <Button size="large" className="border-none bg-gray-100">
                Nổi bật
              </Button>
              {/* <Button size="large" className="border-none bg-gray-100">
                Giảm đau, hạ sốt
              </Button>
              <Button size="large" className="border-none bg-gray-100">
                Thuốc ho
              </Button>
              <Button size="large" className="border-none bg-gray-100">
                Mắt, tai, mũi, họng
              </Button> */}
            </Space>
          </div>
          <Row>
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
          <div className="mt-2 flex justify-center">
            <Button size="large" className="w-1/2 border-primary text-primary">
              Xem tất cả thuốc
              <ChevronRight size={16} className="align-middle" />
            </Button>
          </div>
        </SectionBanner>

        <SectionTitle title="Thần dược chữa rụng tóc">
          <Row>
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
        </SectionTitle>

        <SectionBanner src="https://phuocthien.vn/Images/ImageUpload/2022-11/TOCDE.png">
          <div className="mb-1 flex justify-center">
            <Space size={16}>
              <Button size="large" className="border-none bg-gray-100">
                Nổi bật
              </Button>
              {/* <Button size="large" className="border-none bg-gray-100">
                Giảm đau, hạ sốt
              </Button>
              <Button size="large" className="border-none bg-gray-100">
                Thuốc ho
              </Button>
              <Button size="large" className="border-none bg-gray-100">
                Mắt, tai, mũi, họng
              </Button> */}
            </Space>
          </div>
          <Row>
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
          <div className="mt-2 flex justify-center">
            <Button size="large" className="w-1/2 border-primary text-primary">
              Xem tất cả thuốc
              <ChevronRight size={16} className="align-middle" />
            </Button>
          </div>
        </SectionBanner>
      </div>
    </>
  );
};

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
