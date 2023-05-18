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

  cartStep: 'cart' | 'checkout';
  setCartStep: (cartStep: 'cart' | 'checkout') => void;

  totalPriceAfterDiscountOnProduct: number;
  totalPriceBeforeDiscountOnProduct: number;
  offerCodePrice: number;

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

  cartStep: 'cart',
  setCartStep: () => undefined,

  totalPriceAfterDiscountOnProduct: 0,
  totalPriceBeforeDiscountOnProduct: 0,
  offerCodePrice: 0,

  checkoutForm: undefined,
});

function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const { choosenCartProducts, removeAllChosenProducts } = useCart();
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
    orderNote: string;
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
  const [cartStep, setCartStep] = useState<'cart' | 'checkout'>('cart');

  const totalPriceBeforeDiscountOnProduct = useMemo(
    () =>
      choosenCartProducts.reduce((total, cartProduct) => {
        const retailPrice = cartProduct.product.retailPrice || 0;
        return total + retailPrice * cartProduct.quantity;
      }, 0),
    [choosenCartProducts]
  );

  const totalPriceAfterDiscountOnProduct = useMemo(
    () =>
      choosenCartProducts.reduce((total, cartProduct) => {
        const discountVal = cartProduct.product.promotions?.[0]?.val || 0;
        const productQuantityMinCondition =
          cartProduct.product.promotions?.[0]?.productQuantityMinCondition || 0;
        const retailPrice = cartProduct.product.retailPrice || 0;

        if (cartProduct.quantity >= productQuantityMinCondition) {
          return total + retailPrice * (1 - discountVal) * cartProduct.quantity;
        }

        return total + retailPrice * cartProduct.quantity;
      }, 0),
    [choosenCartProducts]
  );

  const offerCodePrice = useMemo(() => {
    return (offer?.minAmountOffer || 0) <= totalPriceBeforeDiscountOnProduct
      ? offer?.offerVal || 0
      : 0;
  }, [
    offer?.minAmountOffer,
    offer?.offerVal,
    totalPriceBeforeDiscountOnProduct,
  ]);

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

  const getCartProductOrderItem = (cartProduct: {
    product: Product;
    quantity: number;
    note?: string;
  }) => {
    const promotionPercent = cartProduct.product.promotions?.[0];

    const res: {
      productKey: string;
      quantity: number;
      note: string;
      keyPromo?: string;
      keyPromoPercent?: string;
    } = {
      productKey: cartProduct.product.key || '',
      quantity: cartProduct.quantity || 0,
      note: cartProduct.note || '',
    };

    if (
      promotionPercent &&
      cartProduct.quantity >= promotionPercent.productQuantityMinCondition
    ) {
      res.keyPromo = promotionPercent.promotionKey;
      res.keyPromoPercent = promotionPercent.key;
    }

    return res;
  };

  const checkout = async () => {
    try {
      if (!(totalPriceAfterDiscountOnProduct > 10000)) {
        throw new Error('Giá trị đơn hàng phải lớn hơn 10.000đ');
      }

      setCheckingOut(true);

      const valuesToSubmit = checkoutForm.getFieldsValue();

      const order = new OrderClient(null, {});
      const orderResponse = await order.order({
        customerInfo: {
          name: valuesToSubmit.name.trim(),
          tel: valuesToSubmit.tel.trim(),
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
        items: choosenCartProducts.map((cartProduct) =>
          getCartProductOrderItem(cartProduct)
        ),
        offerCode: offer?.offerCode || undefined,
        orderNote: valuesToSubmit.orderNote || undefined,
      });

      removeAllChosenProducts();

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
    if (offer && choosenCartProducts.length > 0) {
      if (totalPriceAfterDiscountOnProduct < (offer.minAmountOffer || 0)) {
        setOffer(undefined);

        setConfirmData({
          title: 'Hủy bỏ mã ưu đãi đã được áp dụng',
          content: `Bạn đang áp dụng mã ưu đãi "${
            offer?.offerCode
          }" với giá trị giảm là ${offer?.offerVal?.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          })}. Tuy nhiên, bạn đã cập nhật giỏ hàng không đủ điều kiện của ưu đãi. Chúng tôi sẽ loại bỏ mã ưu đãi đã áp dụng của bạn`,
          cancelButtonProps: {
            hidden: true,
          },

          onOk: () => {
            toastSuccess({ data: 'Đã hủy bỏ mã ưu đãi' });
          },
          onCancel: () => {
            toastSuccess({ data: 'Đã hủy bỏ mã ưu đãi' });
          },
        });
      }
    }
  }, [
    offer,
    setConfirmData,
    toastSuccess,
    totalPriceAfterDiscountOnProduct,
    choosenCartProducts,
  ]);

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

        cartStep,
        setCartStep,

        totalPriceAfterDiscountOnProduct,
        totalPriceBeforeDiscountOnProduct,
        offerCodePrice,

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
