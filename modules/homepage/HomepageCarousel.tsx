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
    return <div className="relative aspect-[3/1]"></div>;
  }
  sliderImages = [
    ...sliderImages,
    { url: 'https://pt-storage-prd.hn.ss.bfcplatform.vn/ban1.jpg' },
    { url: 'https://pt-storage-prd.hn.ss.bfcplatform.vn/ban2.jpg' },
    { url: 'https://pt-storage-prd.hn.ss.bfcplatform.vn/ban1.jpg' },
  ];
  const pairedSlides = getPairedSlides(sliderImages, numberSlidePerPage);

  return (
    <div className="relative">
      <Carousel
        autoplay
        dots={false}
        fade={type === 'primary'}
        autoplaySpeed={type === 'primary' ? 2500 : 3500}
        ref={(ref) => (carouselRef.current = ref)}
        className="h-[100%] max-w-[100%]"
      >
        {pairedSlides.map((slides, index) => (
          <div className="flex gap-2 lg:gap-4 " key={index}>
            {slides.map((slide, index) => (
              <LinkWrapper
                key={index}
                href={slide.link || ''}
                className="w-full"
              >
                <div className={`flex-1 overflow-hidden`}>
                  <div className={`relative aspect-[3/1]`}>
                    <ImageWithFallback
                      src={slide.url || ''}
                      alt="carousel image"
                      layout="fill"
                      placeholder="blur"
                      sizes={
                        type === 'primary'
                          ? '(min-width: 1024px) 960px, (min-width: 768px) 720px, 400px'
                          : '(min-width: 1024px) 800px, (min-width: 768px) 600px, 400px'
                      }
                      objectFit="cover"
                      className="rounded-xl"
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
            size="small"
            shape="circle"
            aria-label="previous slide"
            onClick={() => carouselRef.current?.prev()}
            icon={<ChevronLeft size={14} />}
            className="absolute top-1/2 left-[16px] -translate-y-1/2 -translate-x-1/2"
          />

          <Button
            size="small"
            shape="circle"
            aria-label="next slide"
            onClick={() => carouselRef.current?.next()}
            icon={<ChevronRight size={14} />}
            className="absolute top-1/2 right-[16px] -translate-y-1/2 translate-x-1/2"
          />
        </>
      )}
    </div>
  );
}

export default HomepageCarousel;
