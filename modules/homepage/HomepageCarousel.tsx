import ImageWithFallback from '@components/templates/ImageWithFallback';
import LinkWrapper from '@components/templates/LinkWrapper';
import { Button, Carousel } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

const getPairedSlides = (
  visibleSlides: { url: string; link?: string }[],
  numberSlidePerPage: number
) => {
  const pairedSlides = [];
  for (let i = 0; i < visibleSlides.length; i += numberSlidePerPage) {
    pairedSlides.push(visibleSlides.slice(i, i + numberSlidePerPage));
  }

  // fill last slide to numberSlidePerPage
  if (pairedSlides.length > 0) {
    const lastSlide = pairedSlides[pairedSlides.length - 1];
    let i = 0;
    while (lastSlide.length < numberSlidePerPage) {
      lastSlide.push(visibleSlides[i++] || '');
    }
  }
  return pairedSlides;
};

function HomepageCarousel({
  sliderImages,
  numberSlidePerPage = 1,
  type = 'secondary',
}: {
  sliderImages?: { url: string; link?: string }[];
  numberSlidePerPage?: number;
  type?: 'primary' | 'secondary';
}) {
  const carouselRef = useRef<CarouselRef | null>(null);

  if (!sliderImages || sliderImages.length === 0) {
    return <div className="relative aspect-[21/9] h-[120px]"></div>;
  }

  const pairedSlides = getPairedSlides(sliderImages, numberSlidePerPage);

  return (
    <div className="relative">
      <Carousel
        autoplay
        dots={false}
        fade={type === 'primary'}
        autoplaySpeed={type === 'primary' ? 2000 : 3500}
        ref={(ref) => (carouselRef.current = ref)}
      >
        {pairedSlides.map((slides, index) => (
          <div className="flex gap-2 lg:gap-4" key={index}>
            {slides.map((slide, index) => (
              <LinkWrapper
                key={index}
                href={slide.link || ''}
                className="w-full"
              >
                <div className={`flex-1 overflow-hidden`}>
                  <div
                    className={`relative aspect-[16/9] h-[${
                      type === 'primary' ? 120 : 80
                    }] lg:h-[${type === 'primary' ? 400 : 200}px] w-full`}
                  >
                    <ImageWithFallback
                      src={slide.url || ''}
                      alt="carousel image"
                      layout="fill"
                      placeholder="blur"
                      sizes={
                        type === 'primary'
                          ? '(min-width: 1200px) 100vw, 100vw'
                          : '(min-width: 768px) 50vw, 100vw'
                      }
                      objectFit={'cover'}
                      objectPosition="center"
                      priority={type === 'primary'}
                    />
                  </div>
                </div>
              </LinkWrapper>
            ))}
          </div>
        ))}
      </Carousel>

      {sliderImages.length > 1 && (
        <>
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
        </>
      )}
    </div>
  );
}

export default HomepageCarousel;
