import ShippingTypes from '@configs/enums/shipping-types.enum';
import { REGEX_PHONE } from '@configs/env';
import OfferModel from '@configs/models/offer.model';
import PaymentMethodModel from '@configs/models/payment-method.model';
import { useCheckout } from '@providers/CheckoutProvider';
import { Form, Typography, Input } from 'antd';
import React from 'react';
import CheckoutPaymentMethodsFormItem from './CheckoutPaymentMethodsFormItem';
import CheckoutShippingType from './CheckoutShippingType';
import CheckoutPrice from './CheckoutPrice';
import CartProductTable from './CartProductTable';

function CheckoutForm({
  paymentMethods,
  offers,
  onCheckout,
}: {
  paymentMethods: PaymentMethodModel[];
  offers: OfferModel[];
  onCheckout: () => void;
}) {
  const { checkoutForm, cartStep } = useCheckout();

  return (
    <Form
      onFinish={() => undefined}
      scrollToFirstError
      form={checkoutForm}
      initialValues={{
        shippingType: ShippingTypes.DELIVERY,
      }}
    >
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr,_400px] lg:gap-4">
        <div>
          <div className="border-none bg-white px-4 py-0 shadow-none md:rounded-lg md:border-solid md:border-gray-100 md:py-4">
            <CartProductTable />

            {cartStep === 'checkout' && (
              <>
                <Typography.Title
                  level={5}
                  className="mt-4 font-medium uppercase"
                >
                  Thông tin nhận hàng
                </Typography.Title>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
                  <Form.Item
                    name="name"
                    className="mb-0 w-full"
                    rules={[
                      {
                        required: true,
                        message: 'Tên không được để trống',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Họ và tên (bắt buộc)"
                      autoComplete="off"
                    />
                  </Form.Item>

                  <Form.Item
                    name="tel"
                    className="mb-0 w-full"
                    rules={[
                      {
                        required: true,
                        message: 'Số điện thoại không được để trống',
                      },
                      {
                        pattern: new RegExp(REGEX_PHONE),
                        message: 'Vui lòng kiểm tra lại số điện thoại',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Số điện thoại (bắt buộc)"
                      autoComplete="off"
                    />
                  </Form.Item>
                </div>

                <CheckoutShippingType />

                <Typography.Title
                  level={5}
                  className="mt-4 font-medium uppercase"
                >
                  Chọn phương thức thanh toán
                </Typography.Title>
                <CheckoutPaymentMethodsFormItem
                  paymentMethods={paymentMethods}
                />

                <Form.Item name="orderNote">
                  <Input.TextArea
                    rows={4}
                    autoComplete="off"
                    placeholder="Nhập ghi chú (nếu có)"
                    className="mt-2"
                  />
                </Form.Item>
              </>
            )}
          </div>
        </div>

        <CheckoutPrice offers={offers} onCheckout={onCheckout} />
      </div>
    </Form>
  );
}

export default CheckoutForm;
