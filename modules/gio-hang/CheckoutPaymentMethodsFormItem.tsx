import ImageWithFallback from '@components/templates/ImageWithFallback';
import PaymentMethodModel from '@configs/models/payment-method.model';
import { Form, Radio, Typography } from 'antd';
import React from 'react';

interface CheckoutPaymentMethodsFormItemProps {
  paymentMethods: PaymentMethodModel[];
}

function CheckoutPaymentMethodsFormItem({
  paymentMethods,
}: CheckoutPaymentMethodsFormItemProps) {
  return (
    <Form.Item
      name="paymentMethodKey"
      className="w-full"
      rules={[
        {
          required: true,
          message: 'Hãy chọn một phương thức thanh toán',
        },
      ]}
    >
      <Radio.Group>
        {paymentMethods.map((paymentMethod) => (
          <Radio
            value={paymentMethod.key}
            key={paymentMethod.key}
            className="my-2 w-full"
          >
            <div className="flex items-center">
              <div className="ml-2">
                <ImageWithFallback
                  src={paymentMethod.image || ''}
                  width={28}
                  height={28}
                  layout="fixed"
                  objectFit="contain"
                />
              </div>
              <div className="ml-4">
                <Typography className="font-medium">
                  {paymentMethod.name}
                </Typography>
                <Typography className=" text-sm text-gray-500">
                  {paymentMethod.description}
                </Typography>
              </div>
            </div>
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
}

export default CheckoutPaymentMethodsFormItem;
