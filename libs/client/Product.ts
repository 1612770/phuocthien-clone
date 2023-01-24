import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import Product from '@configs/models/product.model';
import DrugStore from '@configs/models/drug-store.model';
import WithPagination from '@configs/types/utils/with-pagination';

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
    productionBrandKey?: string;
    filterByName?: string;
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

  async getProduct({ key }: { key: string }): Promise<APIResponse<Product>> {
    return await super.call('GET', `product/${key}`, {});
  }

  async checkInventoryAtDrugStores({ key }: { key: string }): Promise<
    APIResponse<
      {
        drugstore: DrugStore;
        quantity: number;
      }[]
    >
  > {
    return await super.call(
      'GET',
      `product/${key}/inventory-at-drugstores`,
      {}
    );
  }
}
