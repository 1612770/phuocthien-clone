import Product from './product.model';

type ViralProductsListModel = Partial<{
  key: string;
  index: number;
  name: string;
  imageUrl: string;
  visible: boolean;

  totalProductViral?: number;
  listProductViral: {
    key?: string;
    groupViralKey?: string;
    productKey?: string;
    productInfo?: Product;
  }[];
  seoUrl: string;
}>;

export default ViralProductsListModel;
