import ProductTypeGroupModel from './product-type-group.model';
import ProductType from './product-type.model';
import Product from './product.model';

type MenuModel = ProductType;

export interface ProductTypeGroupCategory {
  productGroupSeoUrl: string;
  productTypeGroup: ProductTypeGroupModel[];
  productTypeSeoUrl: string;
  products: Product[];
}

export default MenuModel;
