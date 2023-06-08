import { ExpandOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { Carousel, Button } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import React, { useEffect, useRef, useState } from 'react';

function ProductImageCarousel({
  images,
  onExpand,
  generateThumbnailContainerId,
  generateThumbnailId,
  type = 'default',
  defaultActiveIndex = 0,
}: {
  images: string[];
  onExpand?: (index: number) => void;
  generateThumbnailContainerId?: () => string;
  generateThumbnailId?: (index: number) => string;
  type?: 'default' | 'in-modal';
  defaultActiveIndex?: number;
}) {
  const carouselRef = useRef<CarouselRef | null>();
  const [active, setActive] = useState(defaultActiveIndex);

  useEffect(() => {
    setActive(defaultActiveIndex);
  }, [defaultActiveIndex]);

  const _generateThumbnailContainerId =
    generateThumbnailContainerId || (() => 'image-thumbnail-container');
  const _generateThumbnailId =
    generateThumbnailId || ((index: number) => 'image-' + index + '-thumbnail');

  useEffect(() => {
    carouselRef.current?.goTo(active);

    const container = document.getElementById(
      _generateThumbnailContainerId()
    ) as HTMLDivElement;
    const thumbnail = document.getElementById(
      _generateThumbnailId(active)
    ) as HTMLDivElement;
    if (container && thumbnail) {
      container.scrollTo({
        left:
          thumbnail.offsetWidth * active +
          4 * active +
          (thumbnail.offsetWidth / 2 - container.offsetWidth / 2 + 4),
        behavior: 'smooth',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const imagesToShow = images?.length > 0 ? images : [''];

  return (
    <div className="my-2 lg:col-span-2 xl:col-span-1">
      <div className="relative">
        <Carousel
          className={`rounded-lg border-0 border-solid border-gray-200 lg:border`}
          dots={false}
          beforeChange={(_, index) => {
            setActive(index);
          }}
          effect="scrollx"
          autoplay
          autoplaySpeed={4000}
          ref={(ref) => (carouselRef.current = ref)}
        >
          {imagesToShow.map((image, index) => {
            return (
              <div
                key={index}
                className={`relative ${
                  type === 'in-modal' ? 'h-[60vh]' : 'h-[400px]'
                } w-full`}
              >
                <ImageWithFallback
                  key={image}
                  src={image}
                  alt="product"
                  placeholder="blur"
                  layout="fill"
                  objectFit="contain"
                  className="m-auto w-full"
                />
              </div>
            );
          })}
        </Carousel>

        {onExpand && (
          <Button
            shape="circle"
            className="absolute bottom-2 right-2 border-0 bg-gray-100"
            size="large"
            onClick={() => {
              onExpand(active);
            }}
          >
            <ExpandOutlined />
          </Button>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-2 left-[50%] translate-x-[-50%] transform rounded-full bg-gray-200 px-2 py-1 text-sm font-semibold">
            {active + 1} / {images.length}
          </div>
        )}

        {images.length > 1 && (
          <>
            {active > 0 && (
              <Button
                shape="circle"
                className="absolute top-1/2 left-2 -translate-y-1/2 border-0 bg-gray-100"
                size="large"
                onClick={() => {
                  carouselRef.current?.prev();
                }}
              >
                <LeftOutlined />
              </Button>
            )}
            {active < images.length - 1 && (
              <Button
                shape="circle"
                className="absolute top-1/2 right-2 -translate-y-1/2 border-0 bg-gray-100"
                size="large"
                onClick={() => {
                  carouselRef.current?.next();
                }}
              >
                <RightOutlined />
              </Button>
            )}
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="mt-2 flex gap-[5px] overflow-hidden pb-2"
          id={_generateThumbnailContainerId()}
        >
          {images.map((image, index) => (
            <div
              key={index}
              id={_generateThumbnailId(index)}
              className={
                'relative h-[80px] min-w-[116px] max-w-[116px] cursor-pointer overflow-hidden rounded-lg border border-solid ' +
                (active === index ? 'border-primary' : 'border-gray-200')
              }
              onClick={() => {
                setActive(index);
              }}
            >
              <ImageWithFallback
                src={image}
                alt="product"
                placeholder="blur"
                layout="fill"
                objectFit="contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImageCarousel;
