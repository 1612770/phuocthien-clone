import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import { Campaign, Promotion } from '@configs/models/promotion.model';
import Product from '@configs/models/product.model';

export interface ComboPromotion {
  createdTime: string;
  description?: string;
  discount: {
    productId: string;
    quantity: number;
    type: 'PERCENT' | 'PRICE';
    value: number;
  }[];
  name: string;
  policy?: {
    productId: string;
    productPrice: number;
    requiredQty: number;
  }[];
  promotionComboId: string;
  promotionId: string;
  status: 'ACTIVE';
  totalAmount: number;
  totalCost: number;
  totalDiscount: number;
  updatedTime: string;
  // FE only, for display purpose
  images?: string[];
}

export interface GiftPromotion {
  createdTime: string;
  gift?: {
    productId: string;
    quantity: number;
  }[];
  policy?: {
    productId: string;
    requiredQuantity: number;
    // FE only, for display purpose
    product?: Product;
  }[];
  promotionGiftId: string;
  promotionId: string;
  status: 'ACTIVE';
  updatedTime: string;
}

export interface DealPromotion {
  createdTime: string;
  dealDiscount?: {
    type: 'PERCENT' | 'PRICE';
    value: number;
  };
  policy?: {
    productId: string;
    productPrice: number;
    requiredQty: number;
  }[];
  promotionDealId: string;
  promotionId: string;
  status: 'ACTIVE';
  targetProduct: {
    productId: string;
    productPrice: number;
  };
  totalAmount: number;
  totalCost: number;
  totalDiscount: number;
  updatedTime: string;
}

export class PromotionClient extends BaseClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(ctx: any, data: any) {
    super(ctx, data);
  }

  async getPromo(payload: {
    page: number;
    pageSize: number;
    keyPromo?: string;
    keyCampaign?: string;
    isHide?: boolean;
  }): Promise<APIResponse<Campaign[]>> {
    return await super.call('POST', `promo`, payload);
  }

  async getPromotion(payload: {
    isHide?: boolean;
    promotionSlug?: string;
  }): Promise<APIResponse<Promotion[]>> {
    return await super.callStg('GET', `crm/v1/web/promotion`, {
      q: JSON.stringify({
        isHide: payload.isHide,
        promotionSlug: payload.promotionSlug,
      }),
    });
  }

  async getPromoProducts(payload: {
    page: number;
    pageSize: number;
    keyPromo: string;
    keyPromoPercent?: string;
    isHide?: boolean;
  }): Promise<APIResponse<Product[]>> {
    return await super.call('POST', `promo/products`, payload);
  }
  async getPromotionGiftOfProduct({
    productId,
  }: {
    productId: string;
  }): Promise<APIResponse<GiftPromotion[]>> {
    return await super.callStg('GET', `crm/v1/web/promotion-gift`, {
      q: JSON.stringify({
        productId,
      }),
    });
  }

  async getPromotionCombo({
    promotionSlug,
  }: {
    promotionSlug: string;
  }): Promise<APIResponse<ComboPromotion[]>> {
    return await super.callStg('GET', `crm/v1/web/promotion-combo`, {
      q: JSON.stringify({
        promotionSlug,
      }),
    });
  }

  async getDealActiveOfProduct({
    productId,
  }: {
    productId: string;
  }): Promise<APIResponse<DealPromotion[]>> {
    return await super.callStg('GET', `crm/v1/web/promotion-deal`, {
      q: JSON.stringify({
        productId,
      }),
    });
  }
}
