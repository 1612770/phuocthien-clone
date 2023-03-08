import ImageWithFallback from '@components/templates/ImageWithFallback';
import SlideBannerModel from '@configs/models/slide-banner.model';
import ImageUtils from '@libs/utils/image.utils';
import { Button, Carousel } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

function HomepageCarousel({
  slideBanner,
}: {
  slideBanner: SlideBannerModel[];
}) {
  const carouselRef = useRef<CarouselRef | null>(null);
  if (
    !slideBanner ||
    slideBanner.length === 0 ||
    slideBanner.every(
      (slide) => typeof slide?.visible === 'boolean' && !slide?.visible
    )
  ) {
    return <div className="relative aspect-[21/9] h-[120px]"></div>;
  }

  return (
    <div className="relative">
      <Carousel
        autoplay
        dots={false}
        ref={(ref) => (carouselRef.current = ref)}
      >
        {slideBanner.map((slide) =>
          typeof slide?.visible === 'boolean' && !slide?.visible ? null : (
            <div
              className="relative aspect-[16/9] h-[400px] w-full"
              key={slide.key}
            >
              <ImageWithFallback
                src={slide.imageUrl || ''}
                loading="lazy"
                alt="carousel image"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                getMockImage={ImageUtils.getRandomMockCampaignImageUrl}
              />
            </div>
          )
        )}
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
