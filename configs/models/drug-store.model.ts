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
  mapUrl?: string;
  seoUrl?: string;
  titleSeo?: string;
  metaSeo?: string;
  keywordSeo?: string;
}>;

export default DrugStore;
