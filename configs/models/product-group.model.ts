import ProductTypeGroupModel from './product-type-group.model';

type ProductGroupModel = Partial<{
  key: string;
  index: number;
  code: string;
  name: string;
  image: string;
  visible: boolean;
  seoUrl: string;
  titleSeo: string;
  metaSeo: string;
  keywordSeo: string;
  productTypeGroup: ProductTypeGroupModel[];
  productTypeKey: string;
}>;

export default ProductGroupModel;
