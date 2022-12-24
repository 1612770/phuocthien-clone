import BaseClient from './BaseClient';

export class GeneralClient extends BaseClient {
  constructor(ctx: any, data: any) {
    super(ctx, data);
  }

  async getAllMenu() {
    return await super.call('GET', `full-menu`, {});
  }
}
