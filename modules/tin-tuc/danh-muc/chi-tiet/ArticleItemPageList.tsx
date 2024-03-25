import { Typography } from 'antd';
import React from 'react';
import { Article } from '@configs/models/cms.model';
import LinkWrapper from '@components/templates/LinkWrapper';
import TimeUtils from '@libs/utils/time.utils';
import ImageWithFallback from '@components/templates/ImageWithFallback';

function ArticleItemPageList({
  className,
  article,
  indexBlog,
}: {
  className?: string;
  article?: Article;
  indexBlog?: number;
}): JSX.Element {
  if (!article) return <></>;

  return (
    <div className={`${'lg:col-span-1'}`}>
      <LinkWrapper
        href={`/${article?.category.slug}/${article?.slug}`}
        className={className}
      >
        <div className={`group flex gap-2 lg:gap-4`} title={article?.title}>
          <div className="relative aspect-[3/2] w-full  min-w-[150px] max-w-[800px]  overflow-hidden rounded-lg border border-solid border-gray-100 transition-transform duration-300 group-hover:scale-105">
            <ImageWithFallback
              src={article?.imageUrl || ''}
              layout="fill"
              placeholder="blur"
              objectFit="fill"
            ></ImageWithFallback>
          </div>
          <div className="flex flex-col py-1">
            <div className="mt-1 flex items-center">
              <div className="px- mr-1 mb-0 inline-block w-[fit-content] rounded-full bg-primary-background py-1 text-xs font-semibold text-primary hover:text-primary">
                {article.category.title}
              </div>
            </div>
            <div className="flex-1">
              <Typography.Text className="two-line-text font-medium group-hover:text-primary">
                {article?.title}
              </Typography.Text>
              <Typography.Text className="two-line-text  font-normal text-gray-700">
                {article?.shortDesc}
              </Typography.Text>
            </div>

            {/* <Typography.Text className="text-xs text-gray-500">
                  {TimeUtils.formatDate(article?.publishedTime, {
                    noTime: true,
                  })}
                </Typography.Text> */}
          </div>
        </div>
      </LinkWrapper>
    </div>
  );
}

export default ArticleItemPageList;
