import IMAGES from '@configs/assests/images';
import BrandModel from '@configs/models/brand.model';
import { Typography } from 'antd';
import BrandSlideItems from './BrandSlideItems';
import Image from 'next/image';
import Swiper from '@components/Swiper';

function HomepageBrands({ brands }: { brands: BrandModel[] }) {
  return (
    <div className="lg:container">
      <div className="flex items-center ">
        <div>
          <div className="mr-1 md:mr-4">
            <Image
              src={IMAGES.awards}
              alt="Thương hiệu yêu thích"
              height={50}
              width={50}
              loading="lazy"
            />
          </div>
        </div>
        <div>
          <Typography.Title level={4} className="m-0 font-bold">
            Thương hiệu nổi bật
          </Typography.Title>
        </div>
      </div>

      <Swiper
        autoplay
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          1080: {
            slidesPerView: 3,
          },
        }}
        slidesPerView={5}
      >
        {brands.map((brand, index) =>
          brand ? (
            <div className="w-full p-4 px-3" key={index}>
              <BrandSlideItems brand={brand} />
            </div>
          ) : null
        )}
      </Swiper>
    </div>
  );
}
export default HomepageBrands;
