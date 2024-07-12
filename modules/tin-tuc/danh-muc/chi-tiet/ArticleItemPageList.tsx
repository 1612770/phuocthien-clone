import { Typography } from 'antd';
import React from 'react';
import { Article } from '@configs/models/cms.model';
import LinkWrapper from '@components/templates/LinkWrapper';
import ImageWithFallback from '@components/templates/ImageWithFallback';

function ArticleItemPageList({
  className,
  article,
}: {
  className?: string;
  article?: Article;
}): JSX.Element {
  if (!article) return <></>;

  return (
    <div className={`${'lg:col-span-1'}`}>
      <LinkWrapper href={`/bai-viet/${article?.slug}`} className={className}>
        <div
          className={`group flex flex-col gap-2 md:flex-row`}
          title={article?.title}
        >
          <div className="relative aspect-[3/2] h-[150px] shrink-0 overflow-hidden rounded-lg border border-solid border-gray-100 transition-transform duration-300 group-hover:scale-105 md:h-[120px]">
            <ImageWithFallback
              src={article?.imageUrl || ''}
              layout="fill"
              placeholder="blur"
              objectFit="fill"
            />
          </div>

          <div className="flex flex-col">
            <div className="mt-1 flex items-center">
              <div className="mr-1 mb-0  inline-block w-[fit-content] rounded-full bg-primary-background text-xs font-semibold text-primary hover:text-primary">
                {article.category.title}
              </div>
            </div>
            <div className="flex-1">
              <Typography.Text className="one-line-text text-md  text-ellipsis font-medium group-hover:text-primary">
                {article?.title}
              </Typography.Text>
              <Typography.Text className="three-line-text  text-sm font-normal text-gray-700">
                {article?.shortDesc}
              </Typography.Text>
            </div>
          </div>
        </div>
      </LinkWrapper>
    </div>
  );
}

export default ArticleItemPageList;
