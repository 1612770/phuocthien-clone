import { ExpandOutlined } from '@ant-design/icons';
import Swiper from '@components/Swiper';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { SwiperProps } from 'swiper/react';

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
  const [active, setActive] = useState(defaultActiveIndex);
  const ref = React.useRef<SwiperProps>(null);

  useEffect(() => {
    setActive(defaultActiveIndex);
  }, [defaultActiveIndex]);

  const _generateThumbnailContainerId =
    generateThumbnailContainerId || (() => 'image-thumbnail-container');
  const _generateThumbnailId =
    generateThumbnailId || ((index: number) => 'image-' + index + '-thumbnail');

  useEffect(() => {
    ref.current?.swiper?.slideTo?.(active);

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
        <Swiper
          className={`rounded-lg border-0 border-solid border-gray-200 lg:border`}
          autoplay
          autoplaySpeed={4000}
          onSlideChange={(swiper) => setActive(swiper.activeIndex)}
          ref={ref}
        >
          {imagesToShow.map((image, index) => (
            <div
              key={index}
              className={`relative ${
                type === 'in-modal' ? 'h-[60vh]' : 'h-[400px]'
              } w-full`}
            >
              <ImageWithFallback
                key={image}
                src={image}
                alt="Hình ảnh sản phẩm"
                placeholder="blur"
                layout="fill"
                objectFit="contain"
                className="m-auto w-full"
              />
            </div>
          ))}
        </Swiper>

        {onExpand && (
          <Button
            shape="circle"
            className="absolute bottom-2 right-2 z-10 border-0 bg-gray-100"
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
