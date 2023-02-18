import { Button, Carousel, Image } from 'antd';
import ImageUtils from '@libs/utils/image.utils';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CarouselRef } from 'antd/es/carousel';
import { ChevronLeft, ChevronRight } from 'react-feather';

function ProductCarousel({ images }: { images: string[] }) {
  const carouselRef = useRef<CarouselRef | null>();
  const [active, setActive] = useState(0);

  const mockImages = useMemo(
    () =>
      [...images, ...images, ...images, ...images].map(() =>
        ImageUtils.getRandomMockProductImageUrl()
      ),
    [images]
  );

  useEffect(() => {
    carouselRef.current?.goTo(active);
  }, [active]);

  return (
    <div>
      <div className="relative">
        <Carousel
          className="overflow-hidden rounded-lg "
          dots={false}
          afterChange={(index) => {
            setActive(index);
          }}
          autoplay
          autoplaySpeed={5000}
          ref={(ref) => (carouselRef.current = ref)}
        >
          {mockImages.map((image, index) => {
            return (
              <div key={index} className="relative h-[400px] w-full">
                <Image
                  src={image}
                  alt="product"
                  height={400}
                  width={'100%'}
                  style={{ objectFit: 'contain' }}
                  className="m-auto w-full"
                />
              </div>
            );
          })}
        </Carousel>

        <Button
          shape="circle"
          className="absolute top-1/2 left-2 -translate-y-1/2"
          size="large"
          onClick={() => {
            if (active > 0) {
              setActive(active - 1);
            } else {
              setActive(mockImages.length - 1);
            }
          }}
        >
          <ChevronLeft />
        </Button>
        <Button
          shape="circle"
          className="absolute top-1/2 right-2 -translate-y-1/2"
          size="large"
          onClick={() => {
            if (active < mockImages.length - 1) {
              setActive(active + 1);
            } else {
              setActive(0);
            }
          }}
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="mt-4 flex gap-2 overflow-auto pb-2 lg:gap-4">
        {mockImages.map((image, index) => (
          <div
            key={index}
            className={
              'relative h-[80px] min-w-[120px] max-w-[120px] cursor-pointer overflow-hidden rounded-lg border border-solid ' +
              (active === index ? 'border-primary' : 'border-gray-200')
            }
          >
            <ImageWithFallback
              src={image}
              alt="product"
              layout="fill"
              onClick={() => {
                setActive(index);
              }}
              objectFit="contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCarousel;
