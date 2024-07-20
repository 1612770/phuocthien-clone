import { Button, Divider, Typography } from 'antd';
import { Article, Category } from '@configs/models/cms.model';
import ArticleList from '@modules/tin-tuc/danh-muc/chi-tiet/ArticleList';
import LinkWrapper from '@components/templates/LinkWrapper';
import ArticleItem from '@modules/tin-tuc/danh-muc/chi-tiet/ArticleItem';
import IMAGES from '@configs/assests/images';
import { RightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Image from 'next/image';

function MainInfoSection({
  articles,
  categories,
}: {
  articles: Article[];
  categories: Category[];
}) {
  const router = useRouter();
  return (
    <div className={' bg-white py-2 md:py-4'}>
      <div className={'px-4 lg:container'}>
        <div className="flex items-center lg:mb-2 ">
          <div className="flex items-center ">
            <div className="mr-1 md:mr-4 ">
              <Image
                src={IMAGES.news}
                alt="Góc sức khoẻ"
                className="primary"
                width={50}
                height={50}
                loading="lazy"
              />
            </div>
            <Typography.Title
              level={4}
              className={
                'camelCase m-0  text-primary md:text-center md:font-bold lg:text-left'
              }
            >
              Góc sức khỏe
            </Typography.Title>
          </div>
          <Divider type="vertical" className="ml-4 mr-4 bg-primary" />
          <div className=" text-primary">
            <LinkWrapper href="/bai-viet" className="text-primary">
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

        <div className="mt-4">
          <ArticleList>
            {articles?.map((article, idx) => (
              <ArticleItem
                article={article}
                key={article.id}
                indexBlog={idx}
                className="inline-block md:my-0"
              />
            ))}
          </ArticleList>
        </div>
      </div>
    </div>
  );
}

export default MainInfoSection;
