type PaymentMethodModel = Partial<{
  key: string;
  index: number;
  name: string;
  description: string;
  image: string;
  visible: boolean;
}>;

export default PaymentMethodModel;
