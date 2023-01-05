import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';
import { Button, Carousel } from 'antd';
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
        <div className="relative aspect-[21/9] h-auto max-h-[400px] w-full">
          <ImageWithFallback
            src=""
            loading="lazy"
            alt="carousel image"
            layout="fill"
            objectFit="cover"
            getMockImage={ImageUtils.getRandomMockCampaignImageUrl}
          />
        </div>
        <div className="relative aspect-[21/9] h-auto max-h-[400px] w-full">
          <ImageWithFallback
            src=""
            loading="lazy"
            alt="carousel image"
            layout="fill"
            objectFit="cover"
            getMockImage={ImageUtils.getRandomMockCampaignImageUrl}
          />
        </div>
        <div className="relative aspect-[21/9] h-auto max-h-[400px] w-full">
          <ImageWithFallback
            src=""
            loading="lazy"
            alt="carousel image"
            layout="fill"
            objectFit="cover"
            getMockImage={ImageUtils.getRandomMockCampaignImageUrl}
          />
        </div>
        <div className="relative aspect-[21/9] h-auto max-h-[400px] w-full">
          <ImageWithFallback
            src=""
            loading="lazy"
            alt="carousel image"
            layout="fill"
            objectFit="cover"
            getMockImage={ImageUtils.getRandomMockCampaignImageUrl}
          />
        </div>
      </Carousel>

      <Button
        shape="circle"
        size="large"
        onClick={() => carouselRef.current?.prev()}
        icon={<ChevronLeft />}
        className="absolute top-1/2 left-[32px] -translate-y-1/2 -translate-x-1/2"
      />

      <Button
        shape="circle"
        size="large"
        onClick={() => carouselRef.current?.next()}
        icon={<ChevronRight />}
        className="absolute top-1/2 right-[32px] -translate-y-1/2 translate-x-1/2"
      />
    </div>
  );
}

export default HomepageCarousel;
