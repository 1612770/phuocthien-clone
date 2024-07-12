import { Grid, Typography } from 'antd';
import React from 'react';
import { Article } from '@configs/models/cms.model';
import LinkWrapper from '@components/templates/LinkWrapper';
import ImageWithFallback from '@components/templates/ImageWithFallback';

function ArticleItem({
  className,
  article,
  indexBlog,
  isFromPageList,
}: {
  className?: string;
  article?: Article;
  indexBlog?: number;
  isFromPageList?: boolean;
}): JSX.Element {
  const { sm } = Grid.useBreakpoint();

  if (!article) return <></>;

  const isHeroArticle = indexBlog == 0;

  const shouldDisplayHeroArticle = isHeroArticle && sm;

  return (
    <div
      className={`${
        shouldDisplayHeroArticle
          ? 'row-span-1 lg:col-span-2 lg:row-span-4'
          : 'lg:col-span-1'
      }`}
    >
      <LinkWrapper href={`/bai-viet/${article?.slug}`} className={className}>
        {shouldDisplayHeroArticle ? (
          <div
            className={`group flex flex-col items-center justify-start gap-2 pr-2 lg:flex-col lg:justify-center`}
            title={article?.title}
          >
            <div className="group-hover:scale-103 relative aspect-[3/2] w-full  overflow-hidden rounded-lg border border-solid border-gray-100 transition-transform duration-300">
              <ImageWithFallback
                src={article?.imageUrl || ''}
                layout="fill"
                placeholder="blur"
                objectFit="fill"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex justify-start pb-2">
                <div className="text-md mb-0 inline-block w-[fit-content]  rounded-full border-primary bg-primary-background px-5 py-1 font-semibold text-primary hover:text-primary">
                  {article?.category?.title}
                </div>
              </div>
              <div className="flex-1">
                <Typography.Text className=" text-lg font-medium group-hover:text-primary">
                  {article?.title}
                </Typography.Text>

                <Typography.Text className="two-line-text font-normal text-gray-700 ">
                  {article?.shortDesc}
                </Typography.Text>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`group flex items-center gap-2 lg:items-start ${
              isFromPageList || !sm ? 'flex-col' : 'flex-col sm:flex-row'
            } `}
            title={article?.title}
          >
            <div
              className={`${
                isFromPageList || !sm
                  ? 'w-full'
                  : ' h-[150px]  w-[fit-content] lg:h-[125px]'
              } relative aspect-[3/2] shrink-0 overflow-hidden rounded-lg border border-solid border-gray-100 transition-transform duration-300 group-hover:scale-105 `}
            >
              <ImageWithFallback
                src={article?.imageUrl || ''}
                layout="fill"
                // sizes="(min-width: 1024px) 960px, (min-width: 768px) 720px, 400px"
                placeholder="blur"
                objectFit="cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="mt-1 flex items-center">
                <div className="px- mr-1 mb-0 inline-block w-[fit-content] rounded-full bg-primary-background text-xs font-semibold text-primary hover:text-primary">
                  {article.category.title}
                </div>
              </div>
              <div className="flex-1">
                <Typography.Text className="one-line-text text-md text-ellipsis font-medium group-hover:text-primary">
                  {article?.title}
                </Typography.Text>
                <Typography.Text className="three-line-text text-xs font-normal text-gray-700">
                  {article?.shortDesc}
                </Typography.Text>
              </div>
            </div>
          </div>
        )}
      </LinkWrapper>
    </div>
  );
}

export default ArticleItem;
