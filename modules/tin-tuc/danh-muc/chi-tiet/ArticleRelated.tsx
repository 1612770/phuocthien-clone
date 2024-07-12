import { PlusCircleOutlined } from '@ant-design/icons';
import LinkWrapper from '@components/templates/LinkWrapper';
import { Article } from '@configs/models/cms.model';
import { CmsClient } from '@libs/client/Cms';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ArticleRelated = ({ currentArticle }: { currentArticle: Article }) => {
  const [articlesRelated, setArticlesRelated] = useState<Article[]>([]);

  useEffect(() => {
    const cmsClient = new CmsClient(null, {});
    cmsClient
      .getArticles({
        q: {
          listCategoryIds: [
            currentArticle.categoryId,
            currentArticle.category.underCategoryId,
          ],
          type: 'BLOG',
        },
        limit: 11,
        offset: 0,
      })
      .then((res) => {
        if (res.status === 'OK' && res.data) {
          setArticlesRelated(
            res.data?.filter((el) => el.id != currentArticle.id)
          );
        }
      });

    return () => setArticlesRelated([]);
  }, [currentArticle]);
  return articlesRelated.length > 0 ? (
    <div>
      <div className="mb-2 text-lg font-semibold text-primary">
        <PlusCircleOutlined className=" pr-2 text-primary" />
        Các bài viết liên quan
      </div>
      <div className="grid grid-flow-row grid-cols-1 gap-1 text-sm md:gap-2 lg:grid-cols-2">
        {articlesRelated.slice(0, 10).map((el) => (
          <li
            key={el.id}
            className="pb-1 font-semibold text-primary-dark md:pb-2"
          >
            <LinkWrapper
              href={`/bai-viet/${el.slug}`}
              className="hover:text-primary"
            >
              {el.title}
            </LinkWrapper>
          </li>
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ArticleRelated;
