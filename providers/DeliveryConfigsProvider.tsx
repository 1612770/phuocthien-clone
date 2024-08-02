import React, { useCallback, useMemo, useState } from 'react';
import { OrderClient } from '@libs/client/Order';
import { DeliveryConfigs } from '@configs/models/order.model';
import { useCheckout } from './CheckoutProvider';
import ShippingTypes from '@configs/enums/shipping-types.enum';
import { useCart } from './CartProvider';
import { useMasterData } from './MasterDataProvider';

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
  const { cartProducts } = useCart();
  const { provinces } = useMasterData();

  const listProduct = cartProducts.filter((el) => el.choosen);
  const shippingType = checkoutForm?.getFieldValue('shippingType');
  const _selectedProvinceKey =
    checkoutForm?.getFieldValue('currentProvinceKey');
  // console.log(_selectedProvinceKey);
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
    const listTPCN = listProduct.filter(
      (el) => el.product?.productType?.seoUrl === 'thuc-pham-chuc-nang'
    );
    const sumPriceTPCN = listTPCN.reduce(
      (sum, list) => (sum += (list?.finalPrice || 0) * (list.quantity || 0)),
      0
    );
    let shippingFee = 0;
    if (cartStep === 'checkout' && shippingType === ShippingTypes.DELIVERY) {
      const currentProvince = provinces.find(
        (province) => province.provinceCode === _selectedProvinceKey
      );
      if (currentProvince?.provinceName?.includes('Đà Nẵng')) {
        if (
          totalPriceAfterDiscountOnProduct <=
          (deliveryConfigs?.totalAmountOrderApply || 0)
        ) {
          shippingFee = deliveryConfigs?.feeDelivery || 0;
        }
      } else {
        if (sumPriceTPCN <= (deliveryConfigs?.totalAmountOrderApply || 0)) {
          shippingFee = deliveryConfigs?.feeInterprovincialDelivery || 0;
        }
      }
    }

    return shippingFee;
  }, [
    cartStep,
    deliveryConfigs?.feeDelivery,
    deliveryConfigs?.feeInterprovincialDelivery,
    deliveryConfigs?.totalAmountOrderApply,
    shippingType,
    totalPriceAfterDiscountOnProduct,
    _selectedProvinceKey,
    listProduct,
    provinces,
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
