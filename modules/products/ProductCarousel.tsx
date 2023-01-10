import { Carousel } from 'antd';
import ImageUtils from '@libs/utils/image.utils';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import React, { useMemo, useRef, useState } from 'react';
import { CarouselRef } from 'antd/es/carousel';

function ProductCarousel({ images }: { images: string[] }) {
  const carouselRef = useRef<CarouselRef | null>();
  const [active, setActive] = useState(0);

  let mockImages = useMemo(
    () =>
      [...images, ...images, ...images, ...images].map(() =>
        ImageUtils.getRandomMockProductImageUrl()
      ),
    [images]
  );

  return (
    <div>
      <Carousel
        className="overflow-hidden rounded-lg"
        dots={false}
        ref={(ref) => (carouselRef.current = ref)}
      >
        {mockImages.map((image, index) => {
          return (
            <div key={index} className="relative h-[400px] w-full">
              <ImageWithFallback
                src={image}
                alt="product"
                layout="fill"
                objectFit="cover"
              />
            </div>
          );
        })}
      </Carousel>

      <div className="mt-4 grid grid-cols-4 gap-4">
        {mockImages.map((image, index) => (
          <div
            key={index}
            className={
              'relative h-[80px] w-full cursor-pointer overflow-hidden rounded-lg border border-solid ' +
              (active === index ? 'border-primary' : 'border-gray-200')
            }
          >
            <ImageWithFallback
              src={image}
              alt="product"
              layout="fill"
              onClick={() => {
                setActive(index);
                carouselRef.current?.goTo(index);
              }}
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCarousel;
