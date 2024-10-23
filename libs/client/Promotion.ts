import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import {
  Campaign,
  ComboPromotionModel,
  PromotionModel,
} from '@configs/models/promotion.model';
import Product from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';

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

  async getPromotions(
    payload: Partial<{
      campaignKey: string;
      campaignSlug: string;
      promoKey: string;
      promoSlug: string;
      loadHidePromo: boolean;
      loadItemsInPromo: boolean;
      itemPage: number;
      itemPageSize: number;
      itemGetTotal: boolean;
    }>
  ): Promise<APIResponse<PromotionModel[]>> {
    return await super.call('POST', `promo/items/filter`, payload);
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

  async getPromotionCombo(
    payload: Partial<{
      page: number;
      pageSize: number;
      sortBy: null;
      sortOrder: null;
      filterById: string;
      filterBySlug: string;
      filterByPromoId: null;
      filterByPromoSlug: string;
      filterByCampaignId: null;
      filterByCampaignSlug: string;
      getTotal: boolean;
    }>
  ): Promise<APIResponse<WithPagination<ComboPromotionModel[]>>> {
    if (!payload.page) payload.page = 1;
    if (!payload.pageSize) payload.pageSize = 20;

    return await super.call('POST', `promo/combo/filter`, payload);
  }

  async getPromoCampaignSynthesis(
    payload: Partial<{
      campaignKey: string;
      campaignSlug: string;
      promoKey: string;
      promoSlug: string;
      loadHidePromo: boolean;
      loadItemsInPromo: boolean;
      itemCountInPromo: boolean;
    }>
  ): Promise<APIResponse<Campaign[]>> {
    return await super.call('POST', `promo/campaign-synthesis`, payload);
  }
}
