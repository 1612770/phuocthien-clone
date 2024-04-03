import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import { OrderClient } from './Order';

export class ExternalClient extends BaseClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(ctx: any, data: any) {
    super(ctx, data);
  }

  async getQRPayment({
    totalAmount,
    orderCode,
    source,
  }: {
    totalAmount: string;
    orderCode: string;
    source?: string;
  }): Promise<APIResponse<string>> {
    return await super.callExternal('POST', `v1/payment-qr`, {
      totalAmount,
      orderCode,
      source: source || '',
    });
  }
}
