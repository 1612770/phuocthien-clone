import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import { Campaign } from '@configs/models/promotion.model';
import Product from '@configs/models/product.model';

export class PromotionClient extends BaseClient {
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

  async getPromoProducts(payload: {
    page: number;
    pageSize: number;
    keyPromo: string;
    keyPromoPercent?: string;
    isHide?: boolean;
  }): Promise<APIResponse<Product[]>> {
    return await super.call('POST', `promo/products`, payload);
  }
}
