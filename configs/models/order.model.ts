import OrderStatuses from '@configs/enums/order-statuses.enum';
import DrugStore from './drug-store.model';
import OrderDetailModel from './order-detail.model';
import PaymentMethodModel from './payment-method.model';

type OrderModel = Partial<{
  key: string;
  clientKey: string;
  createdTime: string;
  code: string;
  paymentMethodKey: string;
  subTotalAmount: number;
  shippingFee: number;
  otherFee: number;
  totalAmount: number;
  tel: string;
  shippingType: number;
  drugstoreKey: string;
  receiverName: string;
  receiverTel: string;
  deliveryProvince: string;
  deliveryDistrict: string;
  deliveryWard: string;
  deliveryDetail: string;
  status: OrderStatuses;
  details: OrderDetailModel[];
  paymentMethod: PaymentMethodModel;
  drugstore: DrugStore;
  offerCode: string;
  orderNote: string;
}>;

export default OrderModel;
