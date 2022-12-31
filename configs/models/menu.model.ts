import ProductGroup from './product-group';

type Menu = Partial<{
  key: string;
  index: number;
  code: string;
  name: string;
  image: string;
  productGroups: ProductGroup[];
}>;

export default Menu;
