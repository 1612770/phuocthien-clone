import ShippingTypes from '@configs/enums/shipping-types.enum';
import React, { useEffect, useMemo, useState } from 'react';
import { useCart } from './CartProvider';
import { getErrorMessage } from '@libs/helpers';
import { useRouter } from 'next/router';
import { OrderClient } from '@libs/client/Order';
import Product from '@configs/models/product.model';
import { useAuth } from './AuthProvider';
import SessionStorageUtils, {
  SessionStorageKeys,
} from '@libs/utils/session-storage.utils';
import OfferModel from '@configs/models/offer.model';
import { useAppConfirmDialog } from './AppConfirmDialogProvider';
import { useAppMessage } from '@providers/AppMessageProvider';
import { useMasterData } from './MasterDataProvider';
import { Form, FormInstance } from 'antd';

const CheckoutContext = React.createContext<{
  productStatuses: {
    product: Product;
    statusData: {
      isStillAvailable: boolean;
      drugstoreQuantity?: number;
    };
  }[];
  setProductStatuses: (
    productStatuses: {
      product: Product;
      statusData: {
        isStillAvailable: boolean;
        drugstoreQuantity?: number;
      };
    }[]
  ) => void;

  checkoutError: string;
  setCheckoutError: (checkoutError: string) => void;

  checkingOut: boolean;
  setCheckingOut: (checkingOut: boolean) => void;

  checkout: () => void;

  offer: OfferModel | undefined;
  setOffer: (offer: OfferModel | undefined) => void;

  totalRawPrice: number;
  totalPrice: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkoutForm?: FormInstance<any>;
}>({
  productStatuses: [],
  setProductStatuses: () => undefined,

  checkoutError: '',
  setCheckoutError: () => undefined,

  checkingOut: false,
  setCheckingOut: () => undefined,

  checkout: () => undefined,

  offer: undefined,
  setOffer: () => undefined,

  totalRawPrice: 0,
  totalPrice: 0,

  checkoutForm: undefined,
});

function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const { cartProducts, resetCart } = useCart();
  const { provinces, wards, districts } = useMasterData();
  const router = useRouter();
  const { setConfirmData } = useAppConfirmDialog();
  const { isUserLoggedIn } = useAuth();
  const { toastSuccess } = useAppMessage();
  const [checkoutForm] = Form.useForm<{
    name: string;
    tel: string;
    paymentMethodKey: string;
    shippingType: ShippingTypes;
    currentProvinceKey: string;
    currentDistrictKey: string;
    currentWardKey: string;
    address: string;
    currentDrugStoreKey: string;
  }>();

  const shippingType = Form.useWatch('shippingType', checkoutForm);

  const [productStatuses, setProductStatuses] = useState<
    {
      product: Product;
      statusData: {
        isStillAvailable: boolean;
        drugstoreQuantity?: number;
      };
    }[]
  >([]);

  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const [offer, setOffer] = useState<OfferModel>();

  const totalRawPrice = useMemo(
    () =>
      cartProducts.reduce(
        (total, cartProduct) =>
          total + (cartProduct.product.retailPrice || 0) * cartProduct.quantity,
        0
      ),
    [cartProducts]
  );

  const totalPrice = useMemo(
    () =>
      cartProducts.reduce((total, cartProduct) => {
        const calculatedTotal =
          total + (cartProduct.product.retailPrice || 0) * cartProduct.quantity;

        if ((offer?.minAmountOffer || 0) <= calculatedTotal) {
          return calculatedTotal - (offer?.offerVal || 0);
        }

        return calculatedTotal;
      }, 0),
    [cartProducts, offer]
  );

  const getAddressData = () => {
    const { currentProvinceKey, currentDistrictKey, currentWardKey, address } =
      checkoutForm.getFieldsValue();

    if (!currentProvinceKey || !currentDistrictKey || !currentWardKey) {
      return undefined;
    }
    const province = provinces.find(
      (province) => province.provinceCode === currentProvinceKey
    );
    const district = districts.find(
      (district) => district.districtCode === currentDistrictKey
    );
    const ward = wards.find((ward) => ward.wardName === currentWardKey);

    return {
      province: province?.provinceName || '',
      district: district?.districtName || '',
      ward: ward?.wardName || '',
      detail: address,
    };
  };

  const checkout = async () => {
    try {
      if (!(totalPrice > 10000)) {
        throw new Error('Giá trị đơn hàng phải lớn hơn 10.000đ');
      }

      setCheckingOut(true);

      const valuesToSubmit = checkoutForm.getFieldsValue();

      const order = new OrderClient(null, {});
      const orderResponse = await order.order({
        customerInfo: {
          name: valuesToSubmit.name,
          tel: valuesToSubmit.tel,
        },
        paymentMethodKey: valuesToSubmit.paymentMethodKey,
        shippingType: valuesToSubmit.shippingType,
        drugstoreKey:
          valuesToSubmit.shippingType === ShippingTypes.AT_STORE
            ? valuesToSubmit.currentDrugStoreKey
            : undefined,
        deliveryAddressInfo:
          valuesToSubmit.shippingType === ShippingTypes.DELIVERY
            ? getAddressData()
            : undefined,
        items: cartProducts.map((cartProduct) => ({
          productKey: cartProduct.product.key || '',
          quantity: cartProduct.quantity || 0,
          note: cartProduct.note || '',
        })),
      });

      resetCart();

      if (!isUserLoggedIn) {
        SessionStorageUtils.setItem(
          SessionStorageKeys.NON_AUTHENTICATED_CHECKED_OUT_CART_PRODUCTS,
          JSON.stringify(orderResponse.data)
        );
      }

      router.push(`/dat-hang-thanh-cong/${orderResponse.data?.key}`);
    } catch (error) {
      setCheckoutError(getErrorMessage(error));
    } finally {
      setCheckingOut(false);
    }
  };

  /**
   * If shippingType is changed, reset currentDrugStoreKey
   */
  useEffect(() => {
    if (shippingType === ShippingTypes.DELIVERY) {
      checkoutForm.setFieldsValue({
        currentDrugStoreKey: undefined,
      });
    }
  }, [checkoutForm, shippingType]);
  /**
   * Effect trigger when price change to apply offer
   */
  useEffect(() => {
    if (offer && cartProducts.length > 0) {
      if (totalRawPrice < (offer.minAmountOffer || 0)) {
        setOffer(undefined);

        setConfirmData({
          title: 'Hủy bỏ mã khuyến mãi đã được áp dụng',
          content: `Bạn đang áp dụng mã khuyến mãi "${
            offer?.offerCode
          }" với giá trị giảm là ${offer?.offerVal?.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          })}. Tuy nhiên, bạn đã cập nhật giỏ hàng không đủ điều kiện của khuyến mãi. Chúng tôi sẽ loại bỏ mã khuyến mãi đã áp dụng của bạn`,
          cancelButtonProps: {
            hidden: true,
          },

          onOk: () => {
            toastSuccess({ data: 'Đã hủy bỏ mã khuyến mãi' });
          },
          onCancel: () => {
            toastSuccess({ data: 'Đã hủy bỏ mã khuyến mãi' });
          },
        });
      }
    }
  }, [offer, setConfirmData, toastSuccess, totalRawPrice, cartProducts]);

  return (
    <CheckoutContext.Provider
      value={{
        productStatuses,
        setProductStatuses,

        checkoutError,
        setCheckoutError,

        checkingOut,
        setCheckingOut,

        checkout,

        offer,
        setOffer,

        totalRawPrice,
        totalPrice,

        checkoutForm,
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
