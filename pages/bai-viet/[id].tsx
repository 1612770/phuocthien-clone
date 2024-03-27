import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@components/Breadcrumbs';
import { Article, Category } from '@configs/models/cms.model';
import { CmsClient } from '@libs/client/Cms';
import CategoryChipList from '../../modules/tin-tuc/danh-muc/chi-tiet/CategoryChipList';
import CategoryChipListItem from '../../modules/tin-tuc/danh-muc/chi-tiet/CategoryChipListItem';
import ArticleItem from '../../modules/tin-tuc/danh-muc/chi-tiet/ArticleItem';
import { ChevronsDown } from 'react-feather';
import ArticlePage from '@modules/tin-tuc/danh-muc/chi-tiet/ArticlePage';

interface EventPageProps {
  articles?: Article[];
  categories?: Category[];
  totalArticle: number;
  article?: Article;
}

const EventPage: NextPageWithLayout<EventPageProps> = ({
  articles,
  categories,
  totalArticle,
  article,
}) => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(6);
  const [articlesPage, setArticlesPage] = useState<Article[]>(articles || []);
  useEffect(() => {
    setArticlesPage(articles || []);

    return () => {
      setOffset(0);
      setArticlesPage([]);
    };
  }, [articles]);
  const handleLoadMore = async () => {
    const cmsClient = new CmsClient(null, {});
    const resGetMoreArticle = await cmsClient.getArticles({
      offset: offset + limit,
      limit: limit,
      q: {
        type: 'BLOG',
        listCategoryIds: [
          ...(categories?.[0]?.subCategories.map((el) => el.id) || []),
          categories?.[0].id,
        ],
      },
    });
    if (
      resGetMoreArticle.status === 'OK' &&
      resGetMoreArticle.data &&
      resGetMoreArticle.data.length > 0
    ) {
      setOffset(offset + limit);
      setArticlesPage([...articlesPage, ...resGetMoreArticle.data]);
    }
  };
  if (article) {
    return (
      <div>
        <ArticlePage article={article} />
      </div>
    );
  }
  return (
    <>
      <div className="px-4 pb-4 lg:container lg:px-0">
        <Breadcrumbs
          className="pt-4 pb-2"
          breadcrumbs={[
            {
              title: 'Trang chủ',
              path: '/',
            },
            {
              title: 'Góc sức khoẻ',
              path: '/bai-viet',
            },
            categories?.[0]?.underCategory
              ? {
                  title: categories?.[0]?.underCategory?.title,
                  path: categories?.[0]?.underCategory?.slug,
                }
              : {},
            {
              title: categories?.[0]?.title || '',
            },
          ].filter((value) => JSON.stringify(value) !== '{}')}
        ></Breadcrumbs>
      </div>

      <div className="px-4 pb-4 lg:container lg:px-0">
        <Typography.Title
          level={2}
          className="m-0 mb-2 text-2xl font-medium md:text-4xl"
        >
          {categories?.[0]?.title}
        </Typography.Title>
        <i>{categories?.[0]?.desc}</i>
        <CategoryChipList>
          {categories?.[0]?.subCategories?.map((category) => (
            <CategoryChipListItem
              title={category.title}
              path={`/bai-viet/${category.slug}`}
              key={category.id}
            />
          ))}
        </CategoryChipList>

        <div className="mt-4">
          <div className="grid-row-1 grid grid-flow-row gap-4 lg:grid-flow-row lg:grid-cols-3 lg:grid-rows-2">
            {articlesPage?.map((article) => (
              <ArticleItem
                article={article}
                key={article.id}
                isFromPageList={true}
              ></ArticleItem>
            ))}
          </div>
          {offset + limit < totalArticle && (
            <div
              className="mt-4 cursor-pointer text-center text-primary"
              onClick={handleLoadMore}
            >
              <ChevronsDown />
              <div>Xem thêm {totalArticle - (offset + limit)} bài viết</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: EventPageProps;
  } = {
    props: {
      articles: [],
      categories: [],
      totalArticle: 0,
    },
  };

  const cmsClient = new CmsClient(context, {});
  const categorySlug = String(context.query.id);
  const checkLastId = categorySlug?.split('-');
  const getIdArticle = +checkLastId[checkLastId.length - 1];
  const isArticle = getIdArticle >= 100000;
  if (isArticle) {
    try {
      const getArticle = await cmsClient.getArticles({
        q: {
          slug: categorySlug,
        },
      });
      if (
        getArticle.status === 'OK' &&
        getArticle.data &&
        getArticle.data.length > 0
      ) {
        const article = getArticle.data[0];
        serverSideProps.props.article = article;
        const underCategoryId = article.category.underCategoryId;
        if (underCategoryId) {
          const getUnderCategory = await cmsClient.getCMSCategories({
            q: { type: 'BLOG', id: underCategoryId },
          });
          if (
            getUnderCategory.status === 'OK' &&
            getUnderCategory.data &&
            getUnderCategory.data.length > 0
          ) {
            const underCategory = getUnderCategory.data[0];
            article.category.underCategory = underCategory;
            serverSideProps.props.article = article;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      const getCategory = await cmsClient.getCMSCategories({
        offset: 0,
        q: { type: 'BLOG', slug: categorySlug },
        limit: 100,
      });
      if (getCategory.status === 'OK') {
        const category = getCategory.data;
        serverSideProps.props.categories = category;
        if (category && category?.length > 0) {
          const underCategoryId = category[0].underCategoryId;
          if (underCategoryId) {
            const getUnderCategory = await cmsClient.getCMSCategories({
              q: { type: 'BLOG', id: underCategoryId },
            });
            if (
              getUnderCategory.status === 'OK' &&
              getUnderCategory.data &&
              getUnderCategory.data.length > 0
            ) {
              const underCategory = getUnderCategory.data[0];
              category[0].underCategory = underCategory;
              serverSideProps.props.categories = category;
            }
          }
          const getArticles = await cmsClient.getArticles({
            offset: 0,
            limit: 6,
            getTotal: true,
            q: {
              type: 'BLOG',
              listCategoryIds: [
                ...(category?.[0]?.subCategories.map((el) => el.id) || []),
                category?.[0].id,
              ],
            },
          });
          if (getArticles.status === 'OK' && getArticles.data) {
            serverSideProps.props.articles = getArticles.data;
            serverSideProps.props.totalArticle = getArticles.total || 0;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return serverSideProps;
};

export default EventPage;

EventPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
