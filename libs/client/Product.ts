import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import Product from '@configs/models/product.model';
import DrugStore from '@configs/models/drug-store.model';
import WithPagination from '@configs/types/utils/with-pagination';

export class ProductClient extends BaseClient {
  constructor(ctx: any, data: any) {
    super(ctx, data);
  }

  async getProducts(payload: {
    page: number;
    pageSize: number;
    isPrescripted: boolean;
    productTypeKey?: string;
    productGroupKey?: string;
    productionBrandKey?: string;
  }): Promise<APIResponse<WithPagination<Product[]>>> {
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
    return await super.call('GET', `product/${key}`, {});
  }
}
