import ProductList from '@components/templates/ProductList';
import { Article } from '@configs/models/cms.model';
import useProductAutoLoadByIds from '@libs/utils/hooks/useProductAutoLoadByIds';

const ArticleProductList = ({ article }: { article: Article }) => {
  const { products } = useProductAutoLoadByIds(article.linkedProductIds);
  return products.length > 0 ? (
    <div className="bg-white p-4">
      <ProductList
        products={products}
        forceSlide={true}
        forArticlePage={true}
      />
    </div>
  ) : (
    <></>
  );
};

export default ArticleProductList;
