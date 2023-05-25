import ProductGroupModel from './product-group.model';
import ProductType from './product-type.model';

type OrderDetailModel = Partial<{
  key: string;
  orderKey: string;
  productKey: string;
  index: number;
  inventoryQuantity: number;
  quantity: number;
  price: number;
  totalAmount: number;
  note: string;
  productName: string;
  unit: string;
  imageUrl: string;
  sumOrder: number;
  promoInfo: string;
  productGroup: ProductGroupModel;
  productType: ProductType;
  seoUrl: string;
}>;

export default OrderDetailModel;
