import ShippingTypes from '@configs/enums/shipping-types.enum';
import React, { useEffect, useMemo, useState } from 'react';
import { useCart } from './CartProvider';
import { useRouter } from 'next/router';
import { OrderClient } from '@libs/client/Order';
import Product, { CartProduct } from '@configs/models/product.model';
import { useAuth } from './AuthProvider';
import SessionStorageUtils, {
  SessionStorageKeys,
} from '@libs/utils/session-storage.utils';
import OfferModel from '@configs/models/offer.model';
import { useAppConfirmDialog } from './AppConfirmDialogProvider';
import { useAppMessage } from '@providers/AppMessageProvider';
import { useMasterData } from './MasterDataProvider';
import { Form, FormInstance } from 'antd';
import { ProductClient } from '@libs/client/Product';

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
  checkProductBeforeCheckout: {
    product: CartProduct;
    statusData: {
      isStillAvailable: boolean;
      drugstoreQuantity?: number;
    };
  }[];

  setCheckProductBeforeCheckout: (
    productStatuses: {
      product: CartProduct;
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

  checkingPrice: boolean;
  setCheckingPrice: (checkingPrice: boolean) => void;

  checkout: () => void;

  offer: OfferModel | undefined;
  setOffer: (offer: OfferModel | undefined) => void;

  cartStep: 'cart' | 'checkout';
  setCartStep: (cartStep: 'cart' | 'checkout') => void;

  totalPriceAfterDiscountOnProduct: number;
  totalPriceBeforeDiscountOnProduct: number;
  offerCodePrice: number;

  checkInventoryBeforeCheckOut: () => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkoutForm?: FormInstance<any>;
}>({
  checkProductBeforeCheckout: [],
  setCheckProductBeforeCheckout: () => undefined,
  productStatuses: [],
  setProductStatuses: () => undefined,

  checkoutError: '',
  setCheckoutError: () => undefined,

  checkingOut: false,
  setCheckingOut: () => undefined,

  checkingPrice: false,
  setCheckingPrice: () => undefined,

  checkout: () => undefined,

  offer: undefined,
  setOffer: () => undefined,

  cartStep: 'cart',
  setCartStep: () => undefined,

  totalPriceAfterDiscountOnProduct: 0,
  totalPriceBeforeDiscountOnProduct: 0,
  offerCodePrice: 0,

  checkoutForm: undefined,
  checkInventoryBeforeCheckOut: () => undefined,
});

function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const {
    cartProducts,
    cartCombos,
    cartDeals,
    cartGifts,

    removeAllChosenCartItems,
  } = useCart();

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
  const [checkProductInventory, setCheckProductInventory] = useState<
    {
      product: CartProduct;
      statusData: {
        isStillAvailable: boolean;
        drugstoreQuantity?: number;
      };
    }[]
  >([]);
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
  const [checkingPrice, setCheckingPrice] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [offer, setOffer] = useState<OfferModel>();
  const [cartStep, setCartStep] = useState<'cart' | 'checkout'>('cart');

  const choosenCartProducts = cartProducts.filter(
    (cartProduct) => cartProduct.choosen
  );
  const choosenCartCombos = cartCombos.filter((cartCombo) => cartCombo.choosen);
  const choosenCartGifts = cartGifts.filter((cartGift) => cartGift.choosen);
  const choosenCartDeals = cartDeals.filter((cartDeal) => cartDeal.choosen);

  const totalPriceBeforeDiscountOnProduct = useMemo(() => {
    const productCostPrice = choosenCartProducts.reduce(
      (total, cartProduct) => {
        const retailPrice = cartProduct.product?.retailPrice || 0;
        return total + retailPrice * cartProduct.quantity;
      },
      0
    );
    const comboCostPrice = choosenCartCombos.reduce(
      (total, cartCombo) =>
        total + cartCombo.comboPromotion.totalCost * cartCombo.quantity,
      0
    );
    const giftCostPrice = choosenCartGifts.reduce(
      (total, cartGift) =>
        total +
        (cartGift.giftPromotion.policy || [])?.reduce((total, policy) => {
          return total + (policy.product?.retailPrice || 0);
        }, 0) *
          cartGift.quantity,
      0
    );
    const dealCostPirce = choosenCartDeals.reduce(
      (total, cartDeal) =>
        total + cartDeal.dealPromotion.totalCost * cartDeal.quantity,
      0
    );
    return productCostPrice + comboCostPrice + giftCostPrice + dealCostPirce;
  }, [
    choosenCartCombos,
    choosenCartDeals,
    choosenCartGifts,
    choosenCartProducts,
  ]);

  const totalPriceAfterDiscountOnProduct = useMemo(() => {
    const productCostPriceAfterDiscount = choosenCartProducts.reduce(
      (total, cartProduct) => {
        const discountVal = cartProduct.product?.promotions?.[0]?.val || 0;

        const productQuantityMinCondition =
          cartProduct.product?.promotions?.[0]?.productQuantityMinCondition ||
          0;
        const retailPrice = cartProduct.product?.retailPrice || 0;

        if (cartProduct.quantity >= productQuantityMinCondition) {
          return total + retailPrice * (1 - discountVal) * cartProduct.quantity;
        }

        return total + retailPrice * cartProduct.quantity;
      },
      0
    );

    const comboCostPrice = choosenCartCombos.reduce(
      (total, cartCombo) =>
        total + cartCombo.comboPromotion.totalCost * cartCombo.quantity,
      0
    );
    const giftCostPrice = choosenCartGifts.reduce(
      (total, cartGift) =>
        total +
        (cartGift.giftPromotion.policy || [])?.reduce((total, policy) => {
          return total + (policy.product?.retailPrice || 0);
        }, 0) *
          cartGift.quantity,
      0
    );
    const dealCostPirce = choosenCartDeals.reduce(
      (total, cartDeal) =>
        total + cartDeal.dealPromotion.totalCost * cartDeal.quantity,
      0
    );

    return (
      productCostPriceAfterDiscount +
      comboCostPrice +
      giftCostPrice +
      dealCostPirce
    );
  }, [
    choosenCartCombos,
    choosenCartDeals,
    choosenCartGifts,
    choosenCartProducts,
  ]);

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
    product?: Product;
    quantity: number;
    note?: string;
  }) => {
    const promotionPercent = cartProduct.product?.promotions?.[0];

    const res: {
      productKey: string;
      quantity: number;
      note: string;
      keyPromo?: string;
      keyPromoPercent?: string;
    } = {
      productKey: cartProduct.product?.key || '',
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

  const checkInventoryBeforeCheckOut = async () => {
    setCheckingPrice(true);
    const product = new ProductClient(null, {});
    const _productStatuses: {
      product: CartProduct;
      statusData: {
        isStillAvailable: boolean;
        drugstoreQuantity?: number;
      };
    }[] = [];
    for (let i = 0; i < choosenCartProducts.length; i++) {
      const chooseProduct = choosenCartProducts[i];
      try {
        const getInventoryOfProduct = await product.checkInventoryAtDrugStores({
          key: chooseProduct.product?.key || '',
        });
        if (getInventoryOfProduct.data?.length === 0) {
          _productStatuses.push({
            product: { ...chooseProduct },
            statusData: {
              isStillAvailable: false,
              drugstoreQuantity: 0,
            },
          });
          setCheckoutError(
            'Sản phẩm tạm hết hàng. Vui lòng kiểm tra lại giỏ hàng.'
          );
        } else {
          const totalInventory = getInventoryOfProduct.data?.reduce(
            (curr, el) => curr + el.quantity,
            0
          );
          if (totalInventory == 0 || !totalInventory) {
            _productStatuses.push({
              product: { ...chooseProduct },
              statusData: {
                isStillAvailable: false,
                drugstoreQuantity: 0,
              },
            });
            setCheckoutError(
              'Sản phẩm tạm hết hàng. Vui lòng kiểm tra lại giỏ hàng.'
            );
          } else {
            _productStatuses.push({
              product: { ...chooseProduct },
              statusData: {
                isStillAvailable: totalInventory >= chooseProduct.quantity,
                drugstoreQuantity: totalInventory,
              },
            });
          }
        }
      } catch (error) {
        setCheckoutError(
          'Có lỗi khi kiểm tra tồn kho sản phẩm. Vui lòng thử lại hoặc liên hệ kênh hỗ trợ.'
        );
        setCheckingPrice(false);
      }
    }
    if (!_productStatuses.every((el) => el.statusData?.isStillAvailable)) {
      setCheckoutError(
        'Sản phẩm không đủ số lượng yêu cầu. Vui lòng kiểm tra lại giỏ hàng.'
      );
      setCheckingPrice(false);
    } else {
      setCartStep('checkout');
      setCheckoutError('');
      setCheckingPrice(false);
    }
    setCheckProductInventory(_productStatuses);
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

      removeAllChosenCartItems();

      if (!isUserLoggedIn) {
        SessionStorageUtils.setItem(
          SessionStorageKeys.NON_AUTHENTICATED_CHECKED_OUT_CART_PRODUCTS,
          JSON.stringify(orderResponse.data)
        );
      }

      router.push(`/dat-hang-thanh-cong/${orderResponse.data?.key}`);
    } catch (error) {
      setCheckoutError(
        'Đã có lỗi trong hệ thống. Vui lòng thử lại sau ít phút hoặc liên hệ hỗ trợ.'
      );
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
        checkProductBeforeCheckout: checkProductInventory,
        setCheckProductBeforeCheckout: setCheckProductInventory,

        productStatuses,
        setProductStatuses,

        checkoutError,
        setCheckoutError,

        checkingOut,
        setCheckingOut,

        checkingPrice,
        setCheckingPrice,

        checkout,

        offer,
        setOffer,

        cartStep,
        setCartStep,

        totalPriceAfterDiscountOnProduct,
        totalPriceBeforeDiscountOnProduct,
        offerCodePrice,

        checkoutForm,
        checkInventoryBeforeCheckOut,
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
