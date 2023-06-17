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
}
