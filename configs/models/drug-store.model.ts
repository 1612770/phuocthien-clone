type DrugStore = Partial<{
  key: string;
  code: string;
  name: string;
  address: string;
  tel: string;
  image: string;
  isPrimary: boolean;
  isActived: boolean;
  visible: boolean;
}>;

export default DrugStore;
