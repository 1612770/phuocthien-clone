import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import IMAGES from '@configs/assests/images';
import BrandModel from '@configs/models/brand.model';
import { Button, Carousel, Space, Typography } from 'antd';
import BrandSlideItems from './BrandSlideItems';

function HomepageBrands({ brands }: { brands: BrandModel[] }) {
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
      <div className={`relative'`}>
        <Carousel
          autoplay
          infinite={brands.length > 5}
          arrows={true}
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
          dots={false}
          nextArrow={
            <div className="">
              <Button
                shape="circle"
                size="large"
                className="z-10 translate-x-[-35px] translate-y-[-10px]"
              >
                <RightOutlined />
              </Button>
            </div>
          }
          prevArrow={
            <div className="">
              <Button
                shape="circle"
                size="large"
                className="z-10 translate-x-[15px] translate-y-[-10px]"
              >
                <LeftOutlined />
              </Button>
            </div>
          }
        >
          {brands.map((brand, index) =>
            brand ? (
              <div className="w-full  p-4 px-3" key={index}>
                <BrandSlideItems brand={brand} />
              </div>
            ) : null
          )}
        </Carousel>
      </div>
    </div>
  );
}
export default HomepageBrands;
