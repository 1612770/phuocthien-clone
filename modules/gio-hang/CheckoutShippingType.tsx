import ShippingTypes from '@configs/enums/shipping-types.enum';
import AddressSection from '@modules/cart/AddressSection';
import DrugStorePicker from '@modules/cart/DrugStorePicker';
import { Typography, Form, Radio } from 'antd';
import React from 'react';

function CheckoutShippingType() {
  return (
    <>
      <Typography.Title level={5} className="mt-6 font-medium uppercase">
        Chọn cách thức nhận hàng
      </Typography.Title>
      <Form.Item name="shippingType" className="m-0">
        <Radio.Group>
          <Radio.Button value={ShippingTypes.DELIVERY}>
            Giao tận nơi
          </Radio.Button>
          <Radio.Button value={ShippingTypes.AT_STORE}>
            Nhận tại nhà thuốc
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.shippingType !== currentValues.shippingType
        }
        noStyle
      >
        {({ getFieldValue }) =>
          getFieldValue('shippingType') === ShippingTypes.DELIVERY ? (
            <AddressSection />
          ) : getFieldValue('shippingType') === ShippingTypes.AT_STORE ? (
            <DrugStorePicker />
          ) : null
        }
      </Form.Item>
    </>
  );
}

export default CheckoutShippingType;
