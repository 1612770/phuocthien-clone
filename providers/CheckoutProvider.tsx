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
import { PromotionClient } from '@libs/client/Promotion';
import { PromotionPercent } from '@configs/models/promotion.model';

export const getLargestMatchedMinConditionProduct = (
  promotions: PromotionPercent[],
  productQuantity: number
) => {
  return promotions.reduce((prev, curr) => {
    // xét điều kiện min tối thiểu
    if (curr.productQuantityMinCondition <= productQuantity) {
      if (!prev) {
        return curr;
      }

      // ưu tiên lấy min tối thiểu lớn nhất
      if (curr.productQuantityMinCondition > prev.productQuantityMinCondition) {
        return curr;
      }

      // nếu min tối thiểu bằng nhau, ưu tiên lấy val lớn hơn
      if (
        curr.productQuantityMinCondition === prev.productQuantityMinCondition
      ) {
        // check val
        if (curr.val > prev.val) {
          return curr;
        }

        return prev;
      }

      return prev;
    }

    return prev;
  }, undefined as PromotionPercent | undefined);
};

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
    removeFromCart,
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
  // const _selectedProvinceKey = Form.useWatch(
  //   'currentProvinceKey',
  //   checkoutForm
  // );
  // console.log(
  //   provinces.find((province) => province.provinceCode === _selectedProvinceKey)
  // );
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

  // const [feeShipProvincial,setFeeShipProvincial] =  useState();

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
        const hasAnyPromotion = !!cartProduct.product?.promotions?.length;

        const largestMatchedMinConditionProduct = hasAnyPromotion
          ? getLargestMatchedMinConditionProduct(
              cartProduct.product?.promotions || [],
              cartProduct.quantity
            )
          : undefined;

        const discountVal = largestMatchedMinConditionProduct?.val || 0;

        const productQuantityMinCondition =
          largestMatchedMinConditionProduct?.productQuantityMinCondition || 0;

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
    const largestMatchedMinConditionProduct =
      getLargestMatchedMinConditionProduct(
        cartProduct.product?.promotions || [],
        cartProduct.quantity
      );

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
      largestMatchedMinConditionProduct &&
      cartProduct.quantity >=
        largestMatchedMinConditionProduct.productQuantityMinCondition
    ) {
      res.keyPromo = largestMatchedMinConditionProduct.promotionKey;
      res.keyPromoPercent = largestMatchedMinConditionProduct.key;
    }

    return res;
  };

  const _checkPromotionsInventoryBeforeCheckOut = async () => {
    const promotionClient = new PromotionClient(null, {});
    const [
      comboPromotionResponse,
      giftPromotionResponse,
      dealPromotionResponse,
    ] = await Promise.all([
      promotionClient.getPromotion({
        promotionType: 'COMBO',
      }),
      promotionClient.getPromotion({
        promotionType: 'GIFT',
      }),
      promotionClient.getPromotion({
        promotionType: 'DEAL',
      }),
    ]);

    const comboPromotions = comboPromotionResponse.data || [];
    const giftPromotions = giftPromotionResponse.data || [];
    const dealPromotions = dealPromotionResponse.data || [];

    const notAvailableComboPromotionsInCart = choosenCartCombos.filter(
      (choosenCombo) => {
        const availablePromotion = comboPromotions.find((promotion) => {
          return (
            promotion.promotionId == choosenCombo.comboPromotion.promotionId
          );
        });
        if (!availablePromotion) {
          return true;
        }
        return false;
      }
    );

    const notAvailableGiftPromotionsInCart = choosenCartGifts.filter(
      (choosenGift) => {
        const availablePromotion = giftPromotions.find((promotion) => {
          return promotion.promotionId == choosenGift.giftPromotion.promotionId;
        });

        if (!availablePromotion) {
          return true;
        }
        return false;
      }
    );

    const notAvailableDealPromotionsInCart = choosenCartDeals.filter(
      (choosenDeal) => {
        const availablePromotion = dealPromotions.find((promotion) => {
          return promotion.promotionId == choosenDeal.dealPromotion.promotionId;
        });
        if (!availablePromotion) {
          return true;
        }
        return false;
      }
    );

    if (
      notAvailableComboPromotionsInCart.length ||
      notAvailableGiftPromotionsInCart.length ||
      notAvailableDealPromotionsInCart.length
    ) {
      setConfirmData({
        title: 'Có sản phẩm không còn khuyến mãi',
        content: (
          <>
            Các sản phẩm sau sẽ bị loại bỏ khỏi giỏ hàng vì không còn khuyến
            mãi:
            <ul>
              {notAvailableComboPromotionsInCart.map((combo) => (
                <li key={combo.comboPromotion.promotionId}>
                  {combo.comboPromotion.name}
                </li>
              ))}
              {notAvailableGiftPromotionsInCart.map((gift) => (
                <li key={gift.giftPromotion.promotionId}>
                  Gift #{gift.giftPromotion.promotionGiftId}
                </li>
              ))}
              {notAvailableDealPromotionsInCart.map((deal) => (
                <li key={deal.dealPromotion.promotionId}>
                  Deal #{deal.dealPromotion.promotionDealId}
                </li>
              ))}
            </ul>
          </>
        ),
        cancelButtonProps: {
          hidden: true,
        },
        onOk: () => {
          removeFromCart(
            {
              comboPromotions: notAvailableComboPromotionsInCart.map(
                (cartCombo) => cartCombo.comboPromotion
              ),
              giftPromotions: notAvailableGiftPromotionsInCart.map(
                (cartGift) => cartGift.giftPromotion
              ),
              dealPromotions: notAvailableDealPromotionsInCart.map(
                (cartDeal) => cartDeal.dealPromotion
              ),
            },
            {
              isShowConfirm: false,
            }
          );
          toastSuccess({
            data: 'Đã loại bỏ sản phẩm không còn khuyến mãi khỏi giỏ hàng.',
          });
        },
      });
      throw new Error('Có sản phẩm không còn khuyến mãi');
    }
  };

  const checkInventoryBeforeCheckOut = async () => {
    setCheckingPrice(true);

    if (
      !!choosenCartCombos.length ||
      !!choosenCartGifts.length ||
      !!choosenCartDeals.length
    ) {
      try {
        await _checkPromotionsInventoryBeforeCheckOut();
      } catch (error) {
        setCheckingPrice(false);
        return;
      }
    }

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
