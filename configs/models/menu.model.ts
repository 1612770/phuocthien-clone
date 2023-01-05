type MenuModel = Partial<{
  key: string;
  index: number;
  code: string;
  name: string;
  image: string;
  productGroups: Partial<
    {
      key: string;
      index: number;
      code: string;
      name: string;
      image: string;
    }[]
  >;
}>;

export default MenuModel;
