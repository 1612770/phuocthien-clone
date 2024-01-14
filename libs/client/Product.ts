import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import Product, { InventoryAtDrugStore } from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';
import ViralProductsListModel from '@configs/models/viral-products-list.model';
import { Review } from '@configs/models/review.model';
import { FAQ } from '@configs/models/faq.model';

export class ProductClient extends BaseClient {
  constructor(ctx: unknown, data: unknown) {
    super(ctx, data);
  }

  async getProducts(payload: {
    page: number;
    pageSize: number;
    isPrescripted: boolean;
    productTypeKey?: string;
    productGroupKey?: string;
    productTypeGroupKey?: string;
    productionBrandKeys?: string[];
    filterByName?: string;
    filterByIds?: string[];
    sortBy?: 'GIA_BAN_LE';
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<APIResponse<WithPagination<Product[]>>> {
    if (!payload.sortBy) {
      payload.sortBy = 'GIA_BAN_LE';
    }
    if (!payload.sortOrder) {
      payload.sortOrder = 'ASC';
    }
    return await super.call('POST', `product/filter`, payload);
  }

  async getProduct({
    seoUrl,
  }: {
    seoUrl: string;
  }): Promise<APIResponse<Product>> {
    return await super.call('GET', `product/${seoUrl}`, {});
  }

  async checkInventoryAtDrugStores({
    key,
  }: {
    key: string;
  }): Promise<APIResponse<InventoryAtDrugStore[]>> {
    return await super.call(
      'GET',
      `product/${key}/inventory-at-drugstores`,
      {}
    );
  }

  async getViralProducts(payload: {
    page: number;
    pageSize: number;
    key?: string;
  }): Promise<APIResponse<ViralProductsListModel[]>> {
    return await super.call('POST', `product/viral`, payload);
  }

  async getReviews(payload: {
    page: number;
    pageSize: number;
    key: string;
  }): Promise<APIResponse<WithPagination<Review[]>>> {
    return await super.call('POST', `product/review/list`, payload);
  }

  async createReview(payload: {
    productKey: string;
    description: string;
  }): Promise<APIResponse<void>> {
    return await super.call('POST', `product/review`, payload);
  }

  async getFAQs({ key }: { key: string }): Promise<APIResponse<FAQ[]>> {
    return await super.call('GET', `product/${key}/faq`, {});
  }
}
