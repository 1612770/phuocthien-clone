import { GetServerSidePropsContext } from 'next';
import { Article, Tag } from '@configs/models/cms.model';
import { CmsClient } from '@libs/client/Cms';
import Product from '@configs/models/product.model';
import { ProductClient } from '@libs/client/Product';

const getArticleData = async (context: GetServerSidePropsContext) => {
  const articleData: {
    article?: Article;
    otherArticles?: Article[];
    tags?: Tag[];
    products?: Product[];
  } = {};

  const cmsClient = new CmsClient(context, {});
  const productClient = new ProductClient(context, {});
  const currentArticleSeoUrl = context.params?.lv2Param as string;

  const article = await cmsClient.getArticles({
    q: {
      slug: currentArticleSeoUrl,
    },
  });

  if (article.data?.[0]) {
    articleData.article = article.data[0];

    const [otherArticles, tags, products] = await Promise.all([
      cmsClient.getArticles({
        q: {
          categoryId: article.data[0].categoryId,
        },
      }),
      cmsClient.getCMSTags({
        q: {
          ids: article.data[0].tagIds,
        },
      }),
      ...(article.data[0].linkedProductIds?.length
        ? [
            productClient.getProducts({
              page: 1,
              pageSize: 50,
              isPrescripted: false,
              filterByIds: article.data[0].linkedProductIds || [],
            }),
          ]
        : []),
    ]);

    if (otherArticles.data) {
      const filteredOutCurrentArticle = otherArticles.data.filter(
        (article) => article.id !== articleData.article?.id
      );

      const slicedArticles = filteredOutCurrentArticle.slice(0, 3);

      articleData.otherArticles = slicedArticles;
    }
    articleData.tags = tags.data || [];

    if (products?.data) {
      articleData.products = products.data?.data || [];
    }
  } else {
    throw new Error('Không tìm thấy sự kiện');
  }

  return articleData;
};

export default getArticleData;
