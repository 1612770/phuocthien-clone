import AppDangerouslySetInnerHTML from '@components/AppDangerouslySetInnerHTML';
import Breadcrumbs from '@components/Breadcrumbs';
import TimeUtils from '@libs/utils/time.utils';
import { Divider, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { Clock } from 'react-feather';
import { Article, Tag } from '@configs/models/cms.model';
import Product from '@configs/models/product.model';
import TagChipListItem from './TagChipListItem';
import TagChipList from './TagChipList';
import ArticleRelated from './ArticleRelated';
import ArticleProductList from './ArticleProductList';

const ArticlePage: NextPageWithLayout<{
  article?: Article;
  otherArticles?: Article[];
  tags?: Tag[];
  products?: Product[];
}> = ({ article, otherArticles, tags, products }) => {
  if (!article) return null;

  const isArticleArticle = true;

  return (
    <>
      <div className="px-4 pb-4 lg:container lg:px-0">
        <Breadcrumbs
          className="md:pt-4"
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
              title: article?.category?.underCategory?.title,
              path: `/bai-viet/${article.category?.underCategory?.slug}`,
            },
            {
              title: article.category.title,
              path: `/bai-viet/${article.category?.underCategory?.slug}/${article.category.slug}`,
            },
            {
              title: article.title,
            },
          ].filter((value) => JSON.stringify(value) !== '{}')}
        ></Breadcrumbs>
      </div>

      <div
        className={`px-4 ${
          isArticleArticle
            ? 'md:grid md:grid-cols-[234px_597px_1fr] md:gap-[75px]'
            : 'md:grid-cols-[300px_minmax(200px,_1fr)]'
        } lg:container lg:px-0`}
      >
        <div className="h-full"></div>
        <div className="">
          <div className="mb-6">
            <Typography.Title level={1} className="m-0 text-2xl font-bold ">
              {article?.title}
            </Typography.Title>

            <Typography.Text className="md:text-md m-0 my-2 block text-lg text-gray-600">
              <i>{article?.shortDesc}</i>
            </Typography.Text>

            <Typography.Text className="text-sm text-gray-500">
              <Clock size={16} className=" align-text-bottom" /> Ngày đăng:{' '}
              {TimeUtils.formatDate(article?.publishedTime, { noTime: true })}
            </Typography.Text>
          </div>
          <Divider />

          <AppDangerouslySetInnerHTML
            className={`ck-content w-full text-lg md:text-base ${
              isArticleArticle
                ? ''
                : 'overflow-y-auto rounded-lg border border-gray-500 md:max-h-[80vh] md:border-solid md:p-4'
            } `}
            dangerouslySetInnerHTML={{
              __html: article.content || '',
            }}
          ></AppDangerouslySetInnerHTML>

          <ArticleProductList article={article} />
          {!!tags?.length && (
            <TagChipList>
              {tags?.map((tag, index) => (
                <TagChipListItem key={index} tag={tag} />
              ))}
            </TagChipList>
          )}
          <Divider />
          <ArticleRelated currentArticle={article} />
        </div>

        <div className="h-full"></div>
      </div>
    </>
  );
};

export default ArticlePage;
