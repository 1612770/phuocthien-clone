import ShippingTypes from '@configs/enums/shipping-types.enum';
import React, { useMemo, useState } from 'react';
import { useCart } from './CartProvider';
import { getErrorMessage } from '@libs/helpers';
import { useRouter } from 'next/router';
import { OrderClient } from '@libs/client/Order';

const provincesOfVietNamJSON: {
  [key: string]: {
    name: string;
    'quan-huyen': {
      [key: string]: {
        name: string;
        'xa-phuong': {
          [key: string]: {
            name: string;
          };
        };
      };
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('../public/assets/vn.json');

const CheckoutContext = React.createContext<{
  name: string;
  setName: (name: string) => void;

  tel: string;
  setTel: (tel: string) => void;

  paymentMethodKey: string;
  setPaymentMethodKey: (paymentMethodKey: string) => void;

  shippingType: ShippingTypes;
  setShippingType: (shippingType: ShippingTypes) => void;

  currentProvinceKey: string | null;
  setCurrentProvinceKey: (currentProvinceKey: string | null) => void;

  currentDistrictKey: string | null;
  setCurrentDistrictKey: (currentDistrictKey: string | null) => void;

  currentWardKey: string | null;
  setCurrentWardKey: (currentWardKey: string | null) => void;

  address: string;
  setAddress: (address: string) => void;

  currentDrugStoreKey: string;
  setCurrentDrugStoreKey: (currentDrugStoreKey: string) => void;

  checkoutError: string;
  setCheckoutError: (checkoutError: string) => void;

  checkingOut: boolean;
  setCheckingOut: (checkingOut: boolean) => void;

  currentProvince:
    | {
        name: string;
        'quan-huyen': {
          [key: string]: {
            name: string;
            'xa-phuong': {
              [key: string]: {
                name: string;
              };
            };
          };
        };
      }
    | undefined;

  currentDistrict:
    | {
        name: string;
        'xa-phuong': {
          [key: string]: {
            name: string;
          };
        };
      }
    | undefined;

  checkout: () => void;
}>({
  name: '',
  setName: () => undefined,

  tel: '',
  setTel: () => undefined,

  paymentMethodKey: '',
  setPaymentMethodKey: () => undefined,

  shippingType: ShippingTypes.DELIVERY,
  setShippingType: () => undefined,

  currentProvinceKey: null,
  setCurrentProvinceKey: () => undefined,

  currentDistrictKey: null,
  setCurrentDistrictKey: () => undefined,

  currentWardKey: null,
  setCurrentWardKey: () => undefined,

  address: '',
  setAddress: () => undefined,

  currentDrugStoreKey: '',
  setCurrentDrugStoreKey: () => undefined,

  checkoutError: '',
  setCheckoutError: () => undefined,

  checkingOut: false,
  setCheckingOut: () => undefined,

  currentProvince: undefined,
  currentDistrict: undefined,

  checkout: () => undefined,
});

function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const { cartProducts, resetCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState('');
  const [tel, setTel] = useState('');

  const [paymentMethodKey, setPaymentMethodKey] = useState('');
  const [shippingType, setShippingType] = useState<ShippingTypes>(
    ShippingTypes.DELIVERY
  );

  const [currentProvinceKey, setCurrentProvinceKey] = useState<string | null>(
    null
  );
  const [currentDistrictKey, setCurrentDistrictKey] = useState<string | null>(
    null
  );
  const [currentWardKey, setCurrentWardKey] = useState<string | null>(null);

  const [address, setAddress] = useState('');
  const [currentDrugStoreKey, setCurrentDrugStoreKey] = useState('');

  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const currentProvince = useMemo(() => {
    if (!currentProvinceKey) {
      return undefined;
    }

    return provincesOfVietNamJSON[currentProvinceKey];
  }, [currentProvinceKey]);

  const currentDistrict = useMemo(() => {
    if (!currentDistrictKey) {
      return undefined;
    }
    return currentProvince?.['quan-huyen'][currentDistrictKey];
  }, [currentDistrictKey, currentProvince]);

  const totalPrice = cartProducts.reduce(
    (total, cartProduct) =>
      total + (cartProduct.product.retailPrice || 0) * cartProduct.quantity,
    0
  );

  const checkout = async () => {
    try {
      if (!(totalPrice > 10000)) {
        throw new Error('Giá trị đơn hàng phải lớn hơn 10.000đ');
      }

      setCheckingOut(true);

      const order = new OrderClient(null, {});
      const orderResponse = await order.order({
        customerInfo: {
          name,
          tel,
        },
        paymentMethodKey,
        shippingType,
        drugstoreKey:
          shippingType === ShippingTypes.AT_STORE
            ? currentDrugStoreKey
            : undefined,
        deliveryAddressInfo:
          shippingType === ShippingTypes.DELIVERY
            ? {
                province: currentProvince?.name || '',
                district: currentDistrict?.name || '',
                ward:
                  (currentWardKey &&
                    currentDistrict?.['xa-phuong'][currentWardKey].name) ||
                  '',
                detail: address,
              }
            : undefined,
        items: cartProducts.map((cartProduct) => ({
          productKey: cartProduct.product.key || '',
          quantity: cartProduct.quantity || 0,
          note: cartProduct.note || '',
        })),
      });

      resetCart();
      router.push(`/don-hang/${orderResponse.data?.key}`);
    } catch (error) {
      setCheckoutError(getErrorMessage(error));
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        name,
        setName,

        tel,
        setTel,

        paymentMethodKey,
        setPaymentMethodKey,

        shippingType,
        setShippingType,

        currentProvinceKey,
        setCurrentProvinceKey,

        currentDistrictKey,
        setCurrentDistrictKey,

        currentWardKey,
        setCurrentWardKey,

        address,
        setAddress,

        currentDrugStoreKey,
        setCurrentDrugStoreKey,

        currentProvince,
        currentDistrict,

        checkoutError,
        setCheckoutError,

        checkingOut,
        setCheckingOut,

        checkout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = React.useContext(CheckoutContext);

  return context;
}

export default CheckoutProvider;
