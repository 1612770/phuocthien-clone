import { Button, Carousel, Col, Row } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

function HomepageCarousel() {
  const carouselRef = useRef<CarouselRef | null>(null);

  return (
    <div className="relative">
      <Carousel
        autoplay
        dots={false}
        ref={(ref) => (carouselRef.current = ref)}
      >
        <div className="w-full">
          <Row>
            <Col xs={24} lg={12} className="px-2">
              <img
                className="block h-40 w-full rounded-lg object-cover"
                src="https://phuocthien.vn/Images/ImageUpload/2021-10/amh%20bia.jpg"
                alt="carousel image"
              />
            </Col>
            <Col span={12} className="hidden lg:block">
              <img
                className="block h-40 w-full rounded-lg object-cover"
                src="https://phuocthien.vn/Images/ImageUpload/2022-11/c.jpg"
                alt="carousel image"
              />
            </Col>
          </Row>
        </div>
        <div className="w-full">
          <Row>
            <Col xs={24} lg={12} className="px-2">
              <img
                className="block h-40 w-full rounded-lg object-cover"
                src="https://phuocthien.vn/Images/ImageUpload/2021-10/amh%20bia.jpg"
                alt="carousel image"
              />
            </Col>
            <Col span={12} className="hidden lg:block">
              <img
                className="block h-40 w-full rounded-lg object-cover"
                src="https://phuocthien.vn/Images/ImageUpload/2022-11/c.jpg"
                alt="carousel image"
              />
            </Col>
          </Row>
        </div>
        <div className="w-full">
          <Row>
            <Col xs={24} lg={12} className="px-2">
              <img
                className="block h-40 w-full rounded-lg object-cover"
                src="https://phuocthien.vn/Images/ImageUpload/2021-10/amh%20bia.jpg"
                alt="carousel image"
              />
            </Col>
            <Col span={12} className="hidden lg:block">
              <img
                className="block h-40 w-full rounded-lg object-cover"
                src="https://phuocthien.vn/Images/ImageUpload/2022-11/c.jpg"
                alt="carousel image"
              />
            </Col>
          </Row>
        </div>
      </Carousel>

      <Button
        shape="circle"
        size="large"
        onClick={() => carouselRef.current?.prev()}
        icon={<ChevronLeft />}
        className="absolute top-1/2 left-[28px] -translate-y-1/2 -translate-x-1/2"
      />

      <Button
        shape="circle"
        size="large"
        onClick={() => carouselRef.current?.next()}
        icon={<ChevronRight />}
        className="absolute top-1/2 right-[20px] -translate-y-1/2 translate-x-1/2"
      />
    </div>
  );
}

export default HomepageCarousel;
