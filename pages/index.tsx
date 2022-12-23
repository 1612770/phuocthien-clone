import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import ProductCard from 'components/templates/ProductCard';
import { NextPageWithLayout } from './page';
import Section from 'components/templates/Section';
import { Carousel, Col, Row } from 'antd';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Carousel autoplay>
        <img
          className="h-96 w-full object-cover"
          src="https://phuocthien.vn/Images/ImageUpload/2021-10/amh%20bia.jpg"
          alt="carousel image"
        />
        <img
          className="h-96 w-full object-cover"
          src="https://phuocthien.vn/Images/ImageUpload/2022-11/c.jpg"
          alt="carousel image"
        />
      </Carousel>

      <div className="container">
        <Section title="Sản phẩm bán chạy" className="mt-8">
          <Row gutter={32}>
            <Col span={6}>
              <ProductCard title="Hỗn dịch uống Phosphalugel 20% trị trào ngược dạ dày, thực quản" />
            </Col>
            <Col span={6}>
              <ProductCard title="Khẩu trang y tế Khánh An 4 lớp màu trắng" />
            </Col>
            <Col span={6}>
              <ProductCard title="Nước muối Safin giúp sát khuẩn, súc miệng" />
            </Col>
            <Col span={6}>
              <ProductCard title="Cao dán Salonpas giảm đau, kháng viêm" />
            </Col>
          </Row>
        </Section>

        <Section title="Sản phẩm bán chạy" className="mt-8">
          <Row gutter={32}>
            <Col span={6}>
              <ProductCard title="Hỗn dịch uống Phosphalugel 20% trị trào ngược dạ dày, thực quản" />
            </Col>
            <Col span={6}>
              <ProductCard title="Khẩu trang y tế Khánh An 4 lớp màu trắng" />
            </Col>
            <Col span={6}>
              <ProductCard title="Nước muối Safin giúp sát khuẩn, súc miệng" />
            </Col>
            <Col span={6}>
              <ProductCard title="Cao dán Salonpas giảm đau, kháng viêm" />
            </Col>
          </Row>
        </Section>
      </div>
    </>
  );
};

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
