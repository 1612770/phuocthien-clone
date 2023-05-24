import ProductGroupModel from './product-group.model';

type ProductType = Partial<{
  key: string;
  index: number;
  code: string;
  name: string;
  image: string;
  visible: boolean;
  seoUrl: string;
  productGroups: ProductGroupModel[];
}>;

export default ProductType;
