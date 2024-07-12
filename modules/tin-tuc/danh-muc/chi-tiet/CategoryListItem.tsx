import { Empty, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import SubCategoryList from './SubCategoryList';
import SubCategoryListItem from './SubCategoryListItem';
import { Article, Category } from '@configs/models/cms.model';
import { CmsClient } from '@libs/client/Cms';
import ArticleItemPageList from './ArticleItemPageList';
import LinkWrapper from '@components/templates/LinkWrapper';
import { useRouter } from 'next/router';
import ArticleList from './ArticleList';
import ArticleItem from './ArticleItem';

function CategoryListItem({ category }: { category: Category }) {
  const [articles, setArticle] = useState<Article[]>([]);
  const router = useRouter();

  const onChangeSubCategory = async (categorySlug: string) => {
    router.push({
      pathname: `/bai-viet/${category.slug}/${categorySlug}`,
    });
  };

  useEffect(() => {
    const cmsClient = new CmsClient(null, {});
    cmsClient
      .getArticles({
        q: {
          listCategoryIds: [
            ...(category?.subCategories.map((el) => el.id) || []),
            category.id,
          ],
          type: 'BLOG',
        },
        limit: 6,
        offset: 0,
      })
      .then((resArticle) => {
        if (resArticle?.data && resArticle.status === 'OK') {
          setArticle(resArticle.data);
        }
      });
  }, [category]);

  if (!articles.length) return null;
  return (
    <div className="my-4 rounded-xl bg-none p-0 md:bg-white md:p-2 lg:my-6">
      <div className="flex flex-col items-center justify-between md:flex-row md:items-center">
        <div className="flex flex-col items-center justify-between md:flex-row md:items-center">
          <Typography.Title
            level={5}
            className="m-0 mx-0 mb-2 flex-1 whitespace-nowrap p-0 text-xl  font-medium text-primary md:mx-2 lg:text-2xl"
          >
            {category.title}
          </Typography.Title>

          <SubCategoryList>
            {category.subCategories.map((subCategory) => (
              <SubCategoryListItem
                title={subCategory.title}
                key={subCategory.id}
                categoryId={subCategory.id}
                slug={subCategory.slug}
                onClick={onChangeSubCategory}
              />
            ))}
          </SubCategoryList>
        </div>
        <LinkWrapper href={`/bai-viet/${category.slug}`}>
          <div className="text-md cursor-pointer p-4 hover:text-primary md:text-xs">
            <i>Xem tất cả</i>
          </div>
        </LinkWrapper>
      </div>
      <div className={` py-2 text-sm font-medium`}>
        {/* <ArticleList> */}
        {articles.length > 0 ? (
          <div className="grid-row-1 grid grid-flow-row gap-4 lg:grid-flow-row lg:grid-cols-2 lg:grid-rows-3">
            {articles.map((article) => (
              <ArticleItem key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <Empty description={<div></div>}></Empty>
        )}
        {/* </ArticleList> */}
      </div>
    </div>
  );
}

export default CategoryListItem;
