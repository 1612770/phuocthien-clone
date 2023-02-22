type ProductDetailModel = Partial<{
  key: string;
  displayName: string;
  unsignedName: string;
  oldSellingPrice: number;
  image: string;
  description: string;
  isNew: boolean;
  isHot: boolean;
  isTopTen: boolean;
  isBestSelling: boolean;
  isExclusive: boolean;
  isSaleOff: boolean;
  productKey: string;
}>;

export default ProductDetailModel;
