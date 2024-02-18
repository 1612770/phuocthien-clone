import React, { useCallback, useMemo, useState } from 'react';
import { OrderClient } from '@libs/client/Order';
import { DeliveryConfigs } from '@configs/models/order.model';
import { useCheckout } from './CheckoutProvider';
import ShippingTypes from '@configs/enums/shipping-types.enum';

const DeliveryConfigsContext = React.createContext<{
  deliveryConfigs: DeliveryConfigs | undefined;
  shippingFee: number;
  setDeliveryConfigs: (deliveryConfigs: DeliveryConfigs | undefined) => void;
  getDeliveryConfigs: () => void;
}>({
  deliveryConfigs: undefined,
  shippingFee: 0,
  setDeliveryConfigs: () => undefined,
  getDeliveryConfigs: () => undefined,
});

function DeliveryConfigsProvider({ children }: { children: React.ReactNode }) {
  const [deliveryConfigs, setDeliveryConfigs] = useState<
    DeliveryConfigs | undefined
  >();
  const {
    totalPriceBeforeDiscountOnProduct,
    totalPriceAfterDiscountOnProduct,
    checkoutForm,
    cartStep,
  } = useCheckout();

  const shippingType = checkoutForm?.getFieldValue('shippingType');

  const getDeliveryConfigs = useCallback(async function getDeliveryConfigs() {
    try {
      const orderClient = new OrderClient(null, {});
      const deliveryConfigs = await orderClient.getDeliveryConfigs();

      setDeliveryConfigs(deliveryConfigs.data);
    } catch (error) {
      console.error('getDeliveryConfigs', error);
    }
  }, []);

  const shippingFee = useMemo(() => {
    let shippingFee = 0;
    if (
      shippingType === ShippingTypes.DELIVERY &&
      cartStep === 'checkout' &&
      totalPriceAfterDiscountOnProduct <
        (deliveryConfigs?.totalAmountOrderApply || 0)
    ) {
      shippingFee = deliveryConfigs?.feeDelivery || 0;
    }

    return shippingFee;
  }, [
    cartStep,
    deliveryConfigs?.feeDelivery,
    deliveryConfigs?.totalAmountOrderApply,
    shippingType,
    totalPriceAfterDiscountOnProduct,
  ]);

  return (
    <DeliveryConfigsContext.Provider
      value={{
        deliveryConfigs,
        shippingFee,
        setDeliveryConfigs,
        getDeliveryConfigs,
      }}
    >
      {children}
    </DeliveryConfigsContext.Provider>
  );
}

export function useDeliveryConfigs() {
  const context = React.useContext(DeliveryConfigsContext);

  return context;
}

export default DeliveryConfigsProvider;
