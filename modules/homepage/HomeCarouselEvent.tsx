import Swiper from '@components/Swiper';
import LinkWrapper from '@components/templates/LinkWrapper';
import { Article } from '@configs/models/cms.model';
import Image from 'next/image';

function HomepageCarouselEvent({ articles }: { articles: Article[] }) {
  return (
    <div className="relative h-[150px] w-full">
      <Swiper autoplay>
        {articles.map((article, idx) => (
          <LinkWrapper
            key={idx}
            href={`/bai-viet/${article?.slug}`}
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
      </Swiper>
    </div>
  );
}
export default HomepageCarouselEvent;
