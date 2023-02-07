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
  status: number;
  image: string;
  details: [
    {
      key: string;
      orderKey: string;
      productKey: string;
      index: number;
      inventoryQuantity: number;
      quantity: number;
      price: number;
      totalAmount: number;
      note: string;
    }
  ];
  paymentMethod: {
    key: string;
    index: number;
    name: string;
    description: string;
    image: string;
    visible: boolean;
  };
  drugstore: {
    key: string;
    code: string;
    name: string;
    address: string;
    tel: string;
    image: string;
    isPrimary: boolean;
    isActived: boolean;
    visible: boolean;
  };
}>;

export default OrderModel;
