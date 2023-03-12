import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import ShippingTypes from '@configs/enums/shipping-types.enum';
import OrderModel from '@configs/models/order.model';
import WithPagination from '@configs/types/utils/with-pagination';
import OrderStatuses from '@configs/enums/order-statuses.enum';

export class OrderClient extends BaseClient {
  constructor(ctx: unknown, data: unknown) {
    super(ctx, data);
  }

  async order(payload: {
    customerInfo: {
      name: string;
      tel: string;
    };
    paymentMethodKey: string;
    shippingType: ShippingTypes;
    drugstoreKey?: string;
    deliveryAddressInfo?: {
      province: string;
      district: string;
      ward: string;
      detail: string;
    };
    items: {
      productKey: string;
      quantity: number;
      note: string;
    }[];
    offerCode?: string;
    orderNote?: string;
  }): Promise<APIResponse<OrderModel>> {
    return await super.call('POST', `order`, payload);
  }

  async getOrder({ key }: { key: string }): Promise<APIResponse<OrderModel>> {
    return await super.call('GET', `order/${key}`, {});
  }

  async getOrders(payload: {
    page: number;
    pageSize: number;
    drugstoreKey?: string;
    orderCode?: string;
    status?: OrderStatuses;
  }): Promise<APIResponse<WithPagination<OrderModel[]>>> {
    if (typeof payload.status != 'number') {
      payload.status = OrderStatuses.WAIT_FOR_CONFIRM;
    }

    return await super.call('POST', `order/filter`, payload);
  }
}
