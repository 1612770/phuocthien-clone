import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@components/Breadcrumbs';
import { Article, Category } from '@configs/models/cms.model';
import { CmsClient } from '@libs/client/Cms';
import CategoryChipList from '../../../modules/tin-tuc/danh-muc/chi-tiet/CategoryChipList';
import CategoryChipListItem from '../../../modules/tin-tuc/danh-muc/chi-tiet/CategoryChipListItem';
import ArticleItem from '../../../modules/tin-tuc/danh-muc/chi-tiet/ArticleItem';
import { ChevronsDown } from 'react-feather';
import { loadAll } from '@libs/helpers';

interface EventPageProps {
  articles?: Article[];
  categories?: Category[];
  totalArticle: number;
}

const CategoryListChildrenPage: NextPageWithLayout<EventPageProps> = ({
  articles,
  categories,
  totalArticle,
}) => {
  const [offset, setOffset] = useState(0);
  const [limit] = useState(6);
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

  return (
    <section id="items">
      <div className="px-4 lg:container lg:px-0">
        <Breadcrumbs
          className="md:pb-2 md:pt-4"
          breadcrumbs={[
            {
              title: 'Trang chủ',
              path: '/',
            },
            {
              title: 'Góc sức khoẻ',
              path: '/bai-viet',
            },
            {
              title: categories?.[0]?.underCategory?.title,
              path: `/bai-viet/${categories?.[0]?.underCategory?.slug}`,
            },

            {
              title: categories?.[0]?.title || '',
            },
          ].filter((value) => JSON.stringify(value) !== '{}')}
        ></Breadcrumbs>
      </div>

      <div className="px-4 pb-4 lg:container lg:px-0">
        <Typography.Title
          level={2}
          className="m-0 text-2xl font-medium md:mb-2 md:text-4xl"
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
              <ArticleItem article={article} key={article.id} isFromPageList />
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
    </section>
  );
};

export const getStaticPaths: GetStaticPaths = async (
  context: GetStaticPathsContext
) => {
  const cmsClient = new CmsClient(context, {});

  const categories = await loadAll(
    async ({ offset, limit }) =>
      await cmsClient.getCMSCategories({
        offset,
        limit,
        getTotal: true,
        q: { type: 'BLOG', loadLevel: 1 },
      })
  );

  const paths = categories.reduce((acc, category) => {
    if (category.subCategories && category.subCategories.length > 0) {
      return [
        ...acc,
        ...category.subCategories.map((subCategory) => ({
          params: {
            id: category.slug,
            categoryId: subCategory.slug,
          },
        })),
      ];
    }
    return acc;
  }, [] as { params: { id: string; categoryId: string } }[]);

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const staticProps: ReturnType<GetStaticProps<EventPageProps>> = {
    props: {
      articles: [],
      categories: [],
      totalArticle: 0,
    },
    revalidate: 3600, // 1 day
  };

  const cmsClient = new CmsClient(context, {});

  const categorySlug = String(context.params?.id);
  const subCategorySlug = String(context.params?.categoryId);

  try {
    const categoriesData = await cmsClient.getCMSCategories({
      offset: 0,
      q: { type: 'BLOG', slug: subCategorySlug },
      limit: 100,
    });

    if (categoriesData.status === 'OK') {
      const categories = categoriesData.data;

      staticProps.props.categories = categories;

      if (categories && categories?.length > 0) {
        const category = await cmsClient.getCMSCategories({
          q: { type: 'BLOG', slug: categorySlug },
        });

        if (
          category.status === 'OK' &&
          category.data &&
          category.data.length > 0
        ) {
          const underCategory = category.data[0];
          categories[0].underCategory = underCategory;
          staticProps.props.categories = categories;
        }

        const articlesData = await cmsClient.getArticles({
          offset: 0,
          limit: 6,
          getTotal: true,
          q: {
            type: 'BLOG',
            listCategoryIds: [
              ...(categories?.[0]?.subCategories.map((el) => el.id) || []),
              categories?.[0].id,
            ],
          },
        });

        if (articlesData.status === 'OK' && articlesData.data) {
          staticProps.props.articles = articlesData.data;
          staticProps.props.totalArticle = articlesData.total || 0;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }

  return staticProps;
};

export default CategoryListChildrenPage;

CategoryListChildrenPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
