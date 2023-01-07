import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import MenuModel from '@configs/models/menu.model';
import ProductType from '@configs/models/product-type.model';
import ProductGroupModel from '@configs/models/product-group.model';
import BrandModel from '@configs/models/brand.model';

export class GeneralClient extends BaseClient {
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
}
