import IMAGES from '@configs/assests/images';
import BrandModel from '@configs/models/brand.model';
import { Button, Carousel, Typography } from 'antd';
import BrandSlideItems from './BrandSlideItems';
import { CarouselRef } from 'antd/es/carousel';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

function HomepageBrands({ brands }: { brands: BrandModel[] }) {
  const carouselRef = useRef<CarouselRef | null>(null);

  return (
    <div className="mt-4 lg:container">
      <div className="flex items-center ">
        <div>
          <div className="mr-4">
            <img
              src={IMAGES.awards}
              alt="Thương hiệu yêu thích"
              style={{ minHeight: 48, height: 50 }}
            />
          </div>
        </div>
        <div>
          <Typography.Title level={3} className="m-0 font-bold">
            Thương hiệu nổi bật
          </Typography.Title>
        </div>
      </div>
      <div className="relative">
        <Carousel
          autoplay
          infinite={brands.length > 5}
          dots={false}
          ref={(ref) => (carouselRef.current = ref)}
          responsive={[
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: brands.length > 2,
              },
            },
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: brands.length > 3,
              },
            },
          ]}
          slidesToShow={5}
          slidesToScroll={5}
        >
          {brands.map((brand, index) =>
            brand ? (
              <div className="w-full  p-4 px-3" key={index}>
                <BrandSlideItems brand={brand} />
              </div>
            ) : null
          )}
        </Carousel>
        {brands.length > 1 && (
          <>
            <Button
              shape="circle"
              size="large"
              onClick={() => carouselRef.current?.prev()}
              icon={<ChevronLeft />}
              aria-label="previous slide"
              className="z-999 absolute top-1/2 left-[16px] ml-[16px] flex min-h-[48px] min-w-[48px] -translate-y-1/2 -translate-x-1/2 items-center justify-center md:min-h-[40px] md:min-w-[40px] lg:ml-0"
            />

            <Button
              shape="circle"
              size="large"
              onClick={() => carouselRef.current?.next()}
              icon={<ChevronRight />}
              aria-label="next slide"
              className="z-999 absolute top-1/2 right-[16px] mr-[16px] flex min-h-[48px] min-w-[48px] -translate-y-1/2 translate-x-1/2 items-center justify-center md:min-h-[40px] md:min-w-[40px] lg:mr-0"
            />
          </>
        )}
      </div>
    </div>
  );
}
export default HomepageBrands;
