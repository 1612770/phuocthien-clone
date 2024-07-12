import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import React from 'react';
import Breadcrumbs from '@components/Breadcrumbs';
import { Article, Category } from '@configs/models/cms.model';
import { CmsClient } from '@libs/client/Cms';
import CategoryChipList from '../../modules/tin-tuc/danh-muc/chi-tiet/CategoryChipList';
import CategoryChipListItem from '../../modules/tin-tuc/danh-muc/chi-tiet/CategoryChipListItem';
import CategoryList from '../../modules/tin-tuc/danh-muc/chi-tiet/CategoryList';
import CategoryListItem from '../../modules/tin-tuc/danh-muc/chi-tiet/CategoryListItem';
import ArticleItem from '../../modules/tin-tuc/danh-muc/chi-tiet/ArticleItem';
import ArticleList from '../../modules/tin-tuc/danh-muc/chi-tiet/ArticleList';

interface EventPageProps {
  articles?: Article[];
  categories?: Category[];
}

const EventPage: NextPageWithLayout<EventPageProps> = ({
  articles,
  categories,
}) => {
  return (
    <>
      <div className="px-4 pb-4 lg:container lg:px-0">
        <Breadcrumbs
          className="pb-2 md:pt-4"
          breadcrumbs={[
            {
              title: 'Trang chủ',
              path: '/',
            },
            {
              title: 'Góc sức khoẻ',
            },
          ]}
        ></Breadcrumbs>
      </div>

      <div className="px-4 pb-4 lg:container lg:px-0">
        <Typography.Title
          level={3}
          className="m-0 mb-2 text-2xl font-bold text-primary md:text-4xl"
        >
          Góc sức khoẻ
        </Typography.Title>

        <CategoryChipList>
          {categories?.map((category) => (
            <CategoryChipListItem
              title={category.title}
              path={`/bai-viet/${category.slug}`}
              key={category.id}
            />
          ))}
        </CategoryChipList>

        <div className="mt-4">
          <ArticleList>
            {articles?.map((article, idx) => (
              <ArticleItem article={article} key={article.id} indexBlog={idx} />
            ))}
          </ArticleList>
        </div>

        <CategoryList>
          {categories?.map((category) => (
            <CategoryListItem key={category.id} category={category} />
          ))}
        </CategoryList>
      </div>
    </>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const serverSideProps: ReturnType<GetStaticProps<EventPageProps>> = {
    props: {
      articles: [],
      categories: [],
    },
    revalidate: 3600, // 1 hour
  };

  const cmsClient = new CmsClient(context, {});

  try {
    const [articles, categories] = await Promise.all([
      cmsClient.getArticles({ offset: 0, limit: 5, q: { type: 'BLOG' } }),
      cmsClient.getCMSCategories({
        offset: 0,
        q: { type: 'BLOG', loadLevel: 1 },
        limit: 100,
      }),
    ]);

    if (categories.data) {
      serverSideProps.props.categories = categories.data;
    }

    if (articles.data) {
      serverSideProps.props.articles = articles.data;
    }
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};

export default EventPage;

EventPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
