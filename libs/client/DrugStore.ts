import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import DrugStore from '@configs/models/drug-store.model';

export class DrugstoreClient extends BaseClient {
  constructor(ctx: any, data: any) {
    super(ctx, data);
  }

  async getAllDrugStores(): Promise<APIResponse<DrugStore[]>> {
    return await super.call('GET', `drugstore`, {});
  }

  async getDrugStore({
    key,
  }: {
    key: string;
  }): Promise<APIResponse<DrugStore>> {
    return await super.call('GET', `drugstore/${key}`, {});
  }
}
