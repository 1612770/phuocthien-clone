import APIResponse from '@configs/types/api-response.type';
import BaseClient from '@libs/client/BaseClient';

const serviceV1Path = 'v1';

export class UploadClient extends BaseClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(ctx: any, data: any = null) {
    super(ctx, {
      ...(data || {}),
      contentType: 'multipart/form-data',
    });
  }

  async upload(payload: FormData): Promise<
    APIResponse<{
      url: string;
    }>
  > {
    return await this.callExternal('POST', `${serviceV1Path}/upload`, payload);
  }
}
