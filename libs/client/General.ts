import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import MenuModel from '@configs/models/menu.model';
import ProductType from '@configs/models/product-type.model';
import ProductGroupModel from '@configs/models/product-group.model';
import BrandModel from '@configs/models/brand.model';
import PaymentMethodModel from '@configs/models/payment-method.model';
import FocusContentModel from '@configs/models/focus-content.model';
import SlideBannerModel from '@configs/models/slide-banner.model';
import MainInfoModel from '@configs/models/main-info.model';
import ProductSearchKeyword from '@configs/models/product-search-keyword.model';

export class GeneralClient extends BaseClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(ctx: any, data: any) {
    super(ctx, data);
  }

  async getMenu(): Promise<APIResponse<MenuModel[]>> {
    return await super.call('GET', `full-menu`, {});
  }

  async getProductionBrands(): Promise<APIResponse<BrandModel[]>> {
    return await super.call('GET', `production-brand/all`, {});
  }

  async getProductTypeDetail({
    key,
  }: {
    key: string;
  }): Promise<APIResponse<ProductType>> {
    return await super.call('GET', `product-type/${key}`, {});
  }

  async getProductGroupDetail({
    key,
  }: {
    key: string;
  }): Promise<APIResponse<ProductGroupModel>> {
    return await super.call('GET', `product-group/${key}`, {});
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

  async getMainInfo(): Promise<APIResponse<MainInfoModel[]>> {
    return await super.call('GET', `main-info`, {});
  }

  async getProductSearchKeywords(): Promise<
    APIResponse<ProductSearchKeyword[]>
  > {
    return await super.call('GET', `product-search-keywords`, {});
  }
}
