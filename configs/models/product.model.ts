import ProductImage from './product-image.model';
import ProductGroupModel from './product-group.model';
import ProductBrand from './product-brand.model';
import ProductType from './product-type.model';
import ProductDetailModel from './product-detail.model';
import { Promotion } from './promotion.model';

type Product = Partial<{
  key: string;
  code: string;
  name: string;
  productionCode: string;
  unit: string;
  vat: number;
  sellingPriceRatio: number;
  // Giá mua vào
  purchasePrice: number;
  // Giá bán lẻ
  retailPrice: number;
  // Giá bán buôn
  wholePrice: number;
  reducingRatio: number;
  // Giá vốn
  costPrice: number;
  drugContent: string;
  ingredient: string;
  note: string;
  registrationNumber: string;
  packagingProcess: string;
  isPrescripted: boolean;
  isSpecial: boolean;
  isConsigned: boolean;
  isMental: boolean;
  isDestroyed: boolean;
  visible: boolean;
  productTypeKey: string;
  productGroupKey: string;
  productionBrandKey: string;
  productType: ProductType;
  productGroup: ProductGroupModel;
  productionBrand: ProductBrand;
  detail: ProductDetailModel;
  images: ProductImage[];
  promotions: Promotion[];
}>;

export default Product;
