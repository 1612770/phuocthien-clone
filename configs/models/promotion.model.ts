import Product from './product.model';

export interface PromotionPercent {
  campaignName: string;
  createdAt: string;
  endDateCampaign: string;
  endDatePromo: string;
  key: string;
  productQuantityMinCondition: number;
  promoName: string;
  promotionKey: string;
  startDateCampaign: string;
  startDatePromo: string;
  updatedAt: string;
  val: number;
  showPromoOnPrice?: boolean;
}

export interface PromotionProducts {
  key: string;
  val: number;
  productQuantityMinCondition: number;
  promotionKey: string;
  createdAt: string;
  updatedAt: string;
  products: Omit<
    Product,
    | 'productType'
    | 'productGroup'
    | 'productionBrand'
    | 'images'
    | 'detail'
    | 'promotions'
  >[];
}

export interface Campaign {
  createdAt: string;
  endDate: string;
  imgUrl: string;
  isActive: boolean;
  key: string;
  name: string;
  slug?: string;
  metaSeo?: string;
  promotions: CampaignPromotion[];
  startDate: string;
  updatedAt: string;
}

export interface CampaignPromotion {
  NAME_PROMO: string;
  campaignKey: string;
  createdAt: string;
  endDate: string;
  imgUrl: string | null;
  key: string;
  name: string;
  slug?: string;
  metaSeo?: string;
  promoPercent: CampaignpromotionPercent[];
  startDate: string;
  status: string;
  type: string;
  updatedAt: string;
}

export interface CampaignpromotionPercent {
  createdAt: string;
  key: string;
  productQuantityMinCondition: number;
  promotionKey: string;
  updatedAt: string;
  val: number;
  showPromoOnPrice?: boolean;
}

export interface DealPromotionModel {
  campaignKey: string;
  campaignName: string;
  campaignSlug: string;
  discount: DealPromotionModelDiscount;
  endDateCampaign: string;
  endDatePromo: string;
  key: string;
  policies: Policy[];
  promoName: string;
  promoSlug: string;
  promotionKey: string;
  startDateCampaign: string;
  startDatePromo: string;
  target: Target;
  totalAmount: number;
  totalCost: number;
  totalDiscount: number;
}

interface DealPromotionModelDiscount {
  type: string;
  value: number;
}

interface Policy {
  prodId: string;
  prodInfo: ProdInfo;
  prodPrice: number;
  prodUnit: string | null;
  requiredProdQty: number;
}

interface Target {
  prodId: string;
  prodInfo: ProdInfo;
  prodPrice: number;
  prodUnit: string | null;
  requiredProdQty: number;
}

export interface PromotionModel {
  endDate: string;
  imgUrl: string;
  key: string;
  metaSeo: string;
  name: string;
  promotions: Promotion[];
  slug: string;
  startDate: string;
}

interface Promotion {
  code: string;
  endDate: string;
  imgUrl: string;
  isHide: boolean;
  itemPaging: ItemPaging;
  key: string;
  metaSeo: string;
  name: string;
  promoPercentProds: PromoPercentProd[];
  promoComboes: ComboPromotionModel[];
  slug: string;
  startDate: string;
  type: 'PRODUCT_COMBO';
}

interface ItemPaging {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

interface PromoPercentProd {
  campaignEndDate: string;
  campaignKey: string;
  campaignName: string;
  campaignSlug: string;
  campaignStartDate: string;
  key: string;
  prodId: string;
  prodInfo: ProdInfo;
  prodUnit: string;
  promoEndDate: string;
  promoKey: string;
  promoName: string;
  promoPercentKey: string;
  promoPercentProductQuantityMinCondition: number;
  promoPercentShowPromoOnPrice: boolean;
  promoPercentVal: number;
  promoSlug: string;
  promoStartDate: string;
}

interface ProdInfo {
  detail: ProdDetail;
  isPrescripted: boolean;
  isSpecial: boolean;
  key: string;
  name: string;
  productGroup: ProductGroup;
  productType: ProductType;
  productTypeGroup: ProductTypeGroup;
  productionBrand: ProductionBrand;
  retailPrice: number;
  unit: string;
}

interface ProdDetail {
  displayName: string;
  image: string;
  seoUrl: string;
}

interface ProductGroup {
  image: string;
  key: string;
  name: string;
  seoUrl: string;
}

interface ProductType {
  key: string;
  name: string;
  seoUrl: string;
}

interface ProductTypeGroup {
  image: string;
  key: string;
  name: string;
  seoUrl: string;
}

interface ProductionBrand {
  key: string;
  name: string;
  seoUrl: string;
}

export interface ComboPromotionModel {
  campaignKey: string;
  campaignName: string;
  campaignSlug: string;
  desc: string;
  discounts: ComboPromotionModelDiscount[];
  endDateCampaign: string;
  endDatePromo: string;
  key: string;
  name: string;
  policies: Policy[];
  promoName: string;
  promoSlug: string;
  promotionKey: string;
  slug: string;
  startDateCampaign: string;
  startDatePromo: string;
  totalAmount: number;
  totalCost: number;
  totalDiscount: number;
}

interface ComboPromotionModelDiscount {
  prodId: string;
  prodInfo: ProdInfo;
  prodQty: number;
  prodUnit: string | null;
  type: string;
  value: number;
}

export interface GiftPromotionModel {
  campaignKey: string;
  campaignName: string;
  campaignSlug: string;
  endDateCampaign: string;
  endDatePromo: string;
  gifts: Gift[];
  key: string;
  policies: GiftPromotionModelPolicy[];
}

interface Gift {
  prodId: string;
  prodQty: number;
  prodUnit: string | null;
  prodInfo?: ProdInfo;
}

interface GiftPromotionModelPolicy {
  prodId: string;
  prodInfo: ProdInfo;
  prodUnit: string | null;
  requiredProdQty: number;
}
