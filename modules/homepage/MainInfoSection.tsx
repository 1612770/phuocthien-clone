import { Button, Divider, Empty, Tabs, Typography } from 'antd';
import { Article, Category } from '@configs/models/cms.model';
import ArticleList from '@modules/tin-tuc/danh-muc/chi-tiet/ArticleList';
import LinkWrapper from '@components/templates/LinkWrapper';
import ArticleItem from '@modules/tin-tuc/danh-muc/chi-tiet/ArticleItem';
import IMAGES from '@configs/assests/images';
import { RightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

function MainInfoSection({
  articles,
  categories,
}: {
  articles: Article[];
  categories: Category[];
}) {
  const router = useRouter();
  return (
    <div className={'my-2 bg-white py-4'}>
      <div className={'px-4 lg:container'}>
        <div className="mb-2 flex  items-center lg:mb-2 ">
          <div className="flex items-center ">
            <div className="mr-2 ">
              <img
                src={IMAGES.news}
                alt="Góc sức khoẻ"
                className="primary"
                style={{ minHeight: 48, height: 50 }}
              />
            </div>
            <Typography.Title
              level={3}
              className={
                'camelCase m-0 my-2 text-center font-bold text-primary lg:text-left'
              }
            >
              Góc sức khỏe
            </Typography.Title>
          </div>
          <Divider type="vertical" className="ml-4 mr-4 bg-primary" />
          <div className=" text-primary">
            <LinkWrapper href="/bai-viet">
              Xem tất cả <RightOutlined />
            </LinkWrapper>
          </div>
        </div>
        {categories.map((el) => (
          <Button
            key={el.id}
            className="mr-2 mt-2 rounded-full"
            onClick={() => router.push(`/bai-viet/${el.slug}`)}
          >
            {el.title}
          </Button>
        ))}
        <div className="mt-8">
          <ArticleList>
            {articles?.map((article, idx) => (
              <ArticleItem
                article={article}
                key={article.id}
                indexBlog={idx}
              ></ArticleItem>
            ))}
          </ArticleList>
        </div>
      </div>
    </div>
  );
}

export default MainInfoSection;
