import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import Menu from '@configs/models/menu.model';

export class GeneralClient extends BaseClient {
  constructor(ctx: any, data: any) {
    super(ctx, data);
  }

  async getMenu(): Promise<APIResponse<Menu[]>> {
    return await super.call('GET', `full-menu`, {});
  }
}
