import AppDangerouslySetInnerHTML from '@components/AppDangerouslySetInnerHTML';
import Breadcrumbs from '@components/Breadcrumbs';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import TimeUtils from '@libs/utils/time.utils';
import { useAppData } from '@providers/AppDataProvider';
import { Divider, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { Clock } from 'react-feather';
import MainInfoMenu from './MainInfoMenu';
import MainInfoMenuButton from './MainInfoMenuButton';
import { Article, Tag } from '@configs/models/cms.model';
import Product from '@configs/models/product.model';
import ProductList from '@components/templates/ProductList';
import TagChipListItem from './TagChipListItem';
import TagChipList from './TagChipList';
import ArticleItem from '@modules/tin-tuc/danh-muc/chi-tiet/ArticleItem';

const ArticlePage: NextPageWithLayout<{
  article?: Article;
  otherArticles?: Article[];
  tags?: Tag[];
  products?: Product[];
}> = ({ article, otherArticles, tags, products }) => {
  const { mainInfoFooter } = useAppData();

  if (!article) return null;

  const isArticleArticle = true;

  return (
    <>
      <div className="px-4 lg:container lg:px-0">
        <Breadcrumbs
          className="mt-4 mb-2"
          breadcrumbs={[
            { title: 'Trang chủ', path: '/' },
            { title: 'Góc sức khỏe', path: '/goc-suc-khoe' },
            { title: article?.title },
          ]}
        ></Breadcrumbs>
      </div>

      {/* {article?.imageUrl && (
        <div className="mb-6">
          <Divider className="m-0" />
          <div className="relative h-[400px]">
            <ImageWithFallback
              src={article?.imageUrl || ''}
              layout="fill"
              objectFit="contain"
            ></ImageWithFallback>
          </div>
          <Divider className="m-0" />
        </div>
      )} */}

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
            <Typography.Title
              level={1}
              className="m-0 mt-4 text-2xl font-bold "
            >
              {article?.title}
            </Typography.Title>

            <Typography.Text className="text-md m-0 my-2 block text-gray-600">
              {article?.shortDesc}
            </Typography.Text>

            {!!tags?.length && (
              <TagChipList>
                {tags?.map((tag, index) => (
                  <TagChipListItem key={index} tag={tag} />
                ))}
              </TagChipList>
            )}

            <Typography.Text className="text-sm text-gray-500">
              <Clock size={16} className=" align-text-bottom" /> Ngày đăng:{' '}
              {TimeUtils.formatDate(article?.publishedTime, { noTime: true })}
            </Typography.Text>
          </div>
          <Divider />

          <AppDangerouslySetInnerHTML
            className={`ck-content w-full ${
              isArticleArticle
                ? ''
                : 'overflow-y-auto rounded-lg border border-gray-500 md:max-h-[80vh] md:border-solid md:p-4'
            } `}
            dangerouslySetInnerHTML={{
              __html: article.content || '',
            }}
          ></AppDangerouslySetInnerHTML>

          {!!products?.length && (
            <div className="mb-8 grid grid-cols-1">
              <div className=" lg:container lg:pl-0">
                <Typography.Title
                  level={3}
                  className="mb-4 mt-6 inline-block uppercase lg:mt-12"
                >
                  Sản phẩm liên quan
                </Typography.Title>{' '}
              </div>

              <ProductList products={products} />
            </div>
          )}

          {!!otherArticles?.length && (
            <div className="mb-8 grid grid-cols-1">
              {/* <div className=" lg:container lg:pl-0">
                <Typography.Title
                  level={3}
                  className="mb-4 mt-6 inline-block uppercase lg:mt-12"
                >
                  Các tin tức liên quan
                </Typography.Title>{' '}
              </div> */}

              {/* <div className="lg:container">
                <div className="grid grid-cols-4 gap-4 md:grid-cols-4 lg:gap-6 xl:grid-cols-2">
                  {otherArticles?.map((article, index) => (
                    <ArticleItem article={article} key={index} />
                  ))}
                </div>
              </div> */}
            </div>
          )}
        </div>

        <div className="h-full"></div>
      </div>
    </>
  );
};

export default ArticlePage;
