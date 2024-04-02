import ImageWithFallback from '@components/templates/ImageWithFallback';
import LinkWrapper from '@components/templates/LinkWrapper';
import { Article } from '@configs/models/cms.model';
import MainInfoModel from '@configs/models/main-info.model';
import { Carousel } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import Image from 'next/image';

import { useRef } from 'react';
function HomepageCarouselEvent({ articles }: { articles: Article[] }) {
  const carouselRef = useRef<CarouselRef | null>(null);

  return (
    <div className="relative h-[150px] w-full">
      <Carousel
        autoplay
        dots={false}
        effect="scrollx"
        ref={(ref) => (carouselRef.current = ref)}
      >
        {articles.map((article, idx) => (
          <LinkWrapper
            key={idx}
            href={`/${article?.category?.slug}/${article?.slug}`}
            className="w-full"
          >
            <div className={`flex-1 overflow-hidden`}>
              <div
                className={`relative mt-4 aspect-16/9 h-[150px] w-full rounded-full lg:h-[120px]`}
              >
                <Image
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgwVjB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+"
                  src={`${article.imageUrl || ''}`}
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
