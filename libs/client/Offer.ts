import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import OfferModel from '@configs/models/offer.model';

export class OfferClient extends BaseClient {
  constructor(ctx: any, data: any) {
    super(ctx, data);
  }

  async getAllActiveOffers(): Promise<APIResponse<OfferModel[]>> {
    return await super.call('GET', `offer/active-offers`, {});
  }
}
