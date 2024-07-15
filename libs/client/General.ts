import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import MenuModel, {
  ProductTypeGroupCategory,
} from '@configs/models/menu.model';
import ProductType from '@configs/models/product-type.model';
import ProductGroupModel from '@configs/models/product-group.model';
import BrandModel from '@configs/models/brand.model';
import PaymentMethodModel from '@configs/models/payment-method.model';
import FocusContentModel from '@configs/models/focus-content.model';
import SlideBannerModel from '@configs/models/slide-banner.model';
import MainInfoModel from '@configs/models/main-info.model';
import ProductSearchKeyword from '@configs/models/product-search-keyword.model';
import EventModel from '@configs/models/event.model';
import GroupInfoModel from '@configs/models/GroupInfoModel';
import ProductTypeGroupModel from '@configs/models/product-type-group.model';

export class GeneralClient extends BaseClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(ctx: any, data: any) {
    super(ctx, data);
  }
  // v2
  async getCategoryProduct({
    slugs,
    maxProductResult,
  }: {
    slugs: {
      productTypeSlug: string;
      productGroupSlug: string;
    }[];
    maxProductResult: number;
  }): Promise<APIResponse<ProductTypeGroupCategory[]>> {
    return await super.call(
      'POST',
      'categories',
      { slugs, maxProductResult },
      'v2'
    );
  }

  async getMenu(): Promise<APIResponse<MenuModel[]>> {
    return await super.call('GET', `full-menu`, {});
  }

  async getProductionBrands(): Promise<APIResponse<BrandModel[]>> {
    return await super.call('GET', `production-brand/all`, {});
  }

  async getProductTypeDetail({
    seoUrl,
  }: {
    seoUrl: string;
  }): Promise<APIResponse<ProductType>> {
    return await super.call('GET', `product-type/${seoUrl}`, {});
  }

  async getProductGroupDetail({
    seoUrl,
  }: {
    seoUrl: string;
  }): Promise<APIResponse<ProductGroupModel>> {
    return await super.call('GET', `product-group/${seoUrl}`, {});
  }

  async getProductTypeGroupDetail({
    seoUrl,
  }: {
    seoUrl: string;
  }): Promise<APIResponse<ProductTypeGroupModel[]>> {
    return await super.call('GET', `product-type-group/${seoUrl}`, {});
  }

  async getPaymentMethods(): Promise<APIResponse<PaymentMethodModel[]>> {
    return await super.call('GET', `payment-methods`, {});
  }

  async getFocusContent(): Promise<APIResponse<FocusContentModel[]>> {
    return await super.call('GET', `focus`, {});
  }

  async getSlideBanner(): Promise<APIResponse<SlideBannerModel[]>> {
    return await super.call('GET', `slide-banner`, {});
  }

  async getMainInfos(payload: {
    page: number;
    pageSize: number;
    mainInfoCode?: number;
  }): Promise<APIResponse<MainInfoModel[]>> {
    return await super.call('GET', `main-info`, payload);
  }

  async getGroupInfos(payload: {
    page: number;
    pageSize: number;
    groupSeoUrl?: string;
  }): Promise<APIResponse<GroupInfoModel[]>> {
    return await super.call('GET', `group-info`, payload);
  }

  async getEvent(payload: {
    eventSeoUrl: string;
  }): Promise<APIResponse<EventModel>> {
    return await super.call('GET', `event`, payload);
  }

  async getProductSearchKeywords(): Promise<
    APIResponse<ProductSearchKeyword[]>
  > {
    return await super.call('GET', `product-search-keywords`, {});
  }
}
