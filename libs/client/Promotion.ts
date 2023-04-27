import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import { Campaign, PromotionProducts } from '@configs/models/promotion.model';

export class PromotionClient extends BaseClient {
  constructor(ctx: any, data: any) {
    super(ctx, data);
  }

  async getPromo(payload: {
    page: number;
    pageSize: number;
    keyPromo?: string;
    keyCampaign?: string;
  }): Promise<APIResponse<Campaign[]>> {
    return await super.call('POST', `promo`, payload);
  }

  async getPromoProducts(payload: {
    page: number;
    pageSize: number;
    keyPromo: string;
    keyPromoPercent: string;
  }): Promise<APIResponse<PromotionProducts>> {
    return await super.call('POST', `promo/products`, payload);
  }
}
