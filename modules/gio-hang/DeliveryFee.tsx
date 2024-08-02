import { QuestionCircleFilled } from '@ant-design/icons';
import ShippingTypes from '@configs/enums/shipping-types.enum';
import CurrencyUtils from '@libs/utils/currency.utils';
import { useCheckout } from '@providers/CheckoutProvider';
import { useDeliveryConfigs } from '@providers/DeliveryConfigsProvider';
import { Divider, Tooltip, Typography } from 'antd';
import Link from 'next/link';
import React, { useEffect } from 'react';

function DeliveryFee() {
  const { checkoutForm } = useCheckout();

  const { getDeliveryConfigs, deliveryConfigs, shippingFee } =
    useDeliveryConfigs();

  useEffect(() => {
    getDeliveryConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shippingType = checkoutForm?.getFieldValue('shippingType');

  if (!deliveryConfigs) return null;
  if (shippingType != ShippingTypes.DELIVERY) return null;

  const tooltipTitle = `Đơn hàng có giá trị từ ${deliveryConfigs?.totalAmountOrderApply} trở lên sẽ được miễn phí vận chuyển`;
  return (
    <>
      <Divider className="my-2 lg:my-4"></Divider>
      <div className="my-1 flex justify-between">
        <Link href={'/chinh-sach-giao-hang'} prefetch={false} passHref>
          <a target="_blank">
            <Typography.Text className="text-gray-500">
              Phí vận chuyển{' '}
              <Tooltip title={tooltipTitle}>
                <QuestionCircleFilled />
              </Tooltip>
            </Typography.Text>
          </a>
        </Link>
        {shippingFee ? (
          <Typography.Text className="font-semibold text-gray-700">
            {CurrencyUtils.format(shippingFee)}
          </Typography.Text>
        ) : (
          <Typography.Text className="text-green-500">Miễn phí</Typography.Text>
        )}
      </div>
    </>
  );
}

export default DeliveryFee;
