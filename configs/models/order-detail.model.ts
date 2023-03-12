type OrderDetailModel = Partial<{
  key: string;
  orderKey: string;
  productKey: string;
  index: number;
  inventoryQuantity: number;
  quantity: number;
  price: number;
  totalAmount: number;
  note: string;
  productName: string;
  unit: string;
  imageUrl: string;
}>;

export default OrderDetailModel;
