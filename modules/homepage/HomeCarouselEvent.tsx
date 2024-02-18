import ImageWithFallback from '@components/templates/ImageWithFallback';
import LinkWrapper from '@components/templates/LinkWrapper';
import MainInfoModel from '@configs/models/main-info.model';
import { Carousel } from 'antd';
import { CarouselRef } from 'antd/es/carousel';

import { useRef } from 'react';
function HomepageCarouselEvent({ mainInfos }: { mainInfos?: MainInfoModel }) {
  const events = mainInfos?.groupInfo?.map((el) => {
    return { seoUrl: el.seoUrl, listEvents: el.eventInfos };
  });
  const dataImg: { seoUrl?: string; seoParentUrl?: string; imgUrl?: string }[] =
    [];
  events?.forEach((el) => {
    el?.listEvents?.forEach((_el) => {
      dataImg.push({
        seoUrl: _el.seoUrl,
        imgUrl: _el.imageUrl,
        seoParentUrl: el.seoUrl,
      });
    });
  });
  const carouselRef = useRef<CarouselRef | null>(null);
  if (dataImg.length === 0) {
    return <></>;
  }

  return (
    <div className="relative h-[150px] w-full">
      <Carousel
        autoplay
        dots={false}
        effect="scrollx"
        ref={(ref) => (carouselRef.current = ref)}
      >
        {dataImg.map((imgInfo, idx) => (
          <LinkWrapper
            key={idx}
            href={`/${imgInfo.seoParentUrl}/${imgInfo.seoUrl}`}
            className="w-full"
          >
            <div className={`flex-1 overflow-hidden`}>
              <div
                className={`relative mt-4  h-[150px] w-full rounded-full lg:h-[120px]`}
              >
                <ImageWithFallback
                  src={`/${imgInfo.imgUrl || ''}`}
                  alt="carousel image"
                  layout="fill"
                  placeholder="blur"
                  objectFit={'contain'}
                  className="rounded-xl"
                  objectPosition="center"
                />
              </div>
            </div>
          </LinkWrapper>
        ))}
      </Carousel>
    </div>
  );
}
export default HomepageCarouselEvent;
