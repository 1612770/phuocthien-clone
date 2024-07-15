import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';

export class OthersClient extends BaseClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(ctx: any, data: any) {
    super(ctx, data);
  }

  async detectSlugsRelatedProduct(payload: { slugs: string[] }): Promise<
    APIResponse<{
      productGroupSlugs: string[];
      productSlugs: string[];
      productTypeGroupSlugs: string[];
      productTypeSlugs: string[];
    }>
  > {
    return await super.call('POST', `detect-slugs-related-product`, payload);
  }
}
