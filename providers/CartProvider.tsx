import Product, {
  CartCombo,
  CartDeal,
  CartGift,
  CartProduct,
} from '@configs/models/product.model';
import LocalStorageUtils, {
  LocalStorageKeys,
} from '@libs/utils/local-storage.utils';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAppConfirmDialog } from './AppConfirmDialogProvider';
import { useRouter } from 'next/router';
import { ProductClient } from '@libs/client/Product';
import { getLargestMatchedMinConditionProduct } from './CheckoutProvider';
import {
  ComboPromotionModel,
  DealPromotionModel,
  GiftPromotionModel,
} from '@configs/models/promotion.model';

type CartChangeProductData =
  | {
      field: 'quantity';
      value: number;
    }
  | {
      field: 'finalPrice';
      value: number;
    }
  | {
      field: 'note';
      value: string;
    }
  | {
      field: 'choosen';
      value: boolean;
    };

/**
 * Using final prices of each item in cart to recalculate total price
 * @param cartProducts
 * @returns
 */
const recalculateTotalPrice = ({
  cartProducts,
  cartCombos,
  cartDeals,
  cartGifts,
}: {
  cartProducts: CartProduct[];
  cartCombos: CartCombo[];
  cartDeals: CartDeal[];
  cartGifts: CartGift[];
}) => {
  const calcTotalProductsPrice = cartProducts.reduce(
    (sum, item) => sum + (item?.finalPrice || 0) * item.quantity,
    0
  );

  const calcTotalCombosPrice = cartCombos.reduce(
    (sum, item) => sum + (item?.comboPromotion.totalCost || 0) * item.quantity,
    0
  );

  const dealTotalPrice = cartDeals.reduce(
    (sum, item) => sum + (item?.dealPromotion.totalCost || 0) * item.quantity,
    0
  );

  const giftTotalPrice = cartGifts.reduce(
    (sum, item) =>
      sum +
      (item?.giftPromotion.policies?.reduce(
        (sum, policy) => sum + (policy.prodInfo?.retailPrice || 0),
        0
      ) || 0) *
        item.quantity,
    0
  );

  return (
    calcTotalProductsPrice +
    calcTotalCombosPrice +
    dealTotalPrice +
    giftTotalPrice
  );
};

const CartContext = React.createContext<{
  totalPrice: number;
  cartProducts: CartProduct[];
  cartCombos: CartCombo[];
  cartDeals: CartDeal[];
  cartGifts: CartGift[];
  addToCart: (payload: Omit<CartProduct, 'choosen'>) => void;
  removeFromCart: (
    payload: {
      product?: Product;
      comboPromotion?: ComboPromotionModel;
      dealPromotion?: DealPromotionModel;
      giftPromotion?: GiftPromotionModel;
      comboPromotions?: ComboPromotionModel[];
      dealPromotions?: DealPromotionModel[];
      giftPromotions?: GiftPromotionModel[];
    },
    options?: {
      isShowConfirm?: boolean;
    }
  ) => void;
  changeCartItemData: (
    {
      comboPromotion,
      product,
      dealPromotion,
      giftPromotion,
    }: {
      comboPromotion?: ComboPromotionModel;
      product?: Product;
      dealPromotion?: DealPromotionModel;
      giftPromotion?: GiftPromotionModel;
    },
    payload: CartChangeProductData
  ) => void;
  setChoosenAllCart: (choosen: boolean) => void;
  removeAllChosenCartItems: () => void;

  modeShowPopup: 'cart-button' | 'fixed';
  setModeShowPopup: React.Dispatch<
    React.SetStateAction<'cart-button' | 'fixed'>
  >;
  isOpenNotification: boolean;
  recentAddedToCartType: 'product' | 'combo' | 'deal' | 'gift' | '';

  loadingProductsByDataFromLocalStorage: boolean;
  loadProductsByDataFromLocalStorage: () => Promise<void>;
}>({
  totalPrice: 0,
  cartProducts: [],
  cartCombos: [],
  cartDeals: [],
  cartGifts: [],
  addToCart: () => undefined,
  removeFromCart: () => undefined,
  changeCartItemData: () => undefined,
  setChoosenAllCart: () => undefined,
  removeAllChosenCartItems: () => undefined,

  modeShowPopup: 'cart-button',
  setModeShowPopup: () => undefined,
  isOpenNotification: false,
  recentAddedToCartType: '',

  loadingProductsByDataFromLocalStorage: false,
  loadProductsByDataFromLocalStorage: () => Promise.resolve(),
});

function CartProvider({ children }: { children: React.ReactNode }) {
  const [modeShowPopup, setModeShowPopup] = useState<'cart-button' | 'fixed'>(
    'cart-button'
  );
  const [recentAddedToCartType, setRecentAddedToCartType] = useState<
    'product' | 'combo' | 'deal' | 'gift' | ''
  >('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loadingProductsByDataFromLocalStorage, setloadingCartProducts] =
    useState(false);

  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [cartCombos, setCartCombos] = useState<CartCombo[]>([]);
  const [cartDeals, setCartDeals] = useState<CartDeal[]>([]);
  const [cartGifts, setCartGifts] = useState<CartGift[]>([]);

  const { setConfirmData } = useAppConfirmDialog();
  const router = useRouter();
  const showPopupIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const _recalculateTotalPrice = useCallback(() => {
    setTotalPrice(
      recalculateTotalPrice({
        cartProducts,
        cartCombos,
        cartDeals,
        cartGifts,
      })
    );
  }, [cartCombos, cartDeals, cartGifts, cartProducts]);

  useEffect(() => {
    _recalculateTotalPrice();
  }, [_recalculateTotalPrice]);

  /**
   * Get all cart items from local storage
   */
  useEffect(() => {
    const cartProducts = JSON.parse(
      LocalStorageUtils.getItem(LocalStorageKeys.CART_PRODUCTS) || '[]'
    );
    setCartProducts(cartProducts);

    const cartCombos = JSON.parse(
      LocalStorageUtils.getItem(LocalStorageKeys.CART_COMBOS) || '[]'
    );
    setCartCombos(cartCombos);

    const cartDeals = JSON.parse(
      LocalStorageUtils.getItem(LocalStorageKeys.CART_DEALS) || '[]'
    );
    setCartDeals(cartDeals);

    const cartGifts = JSON.parse(
      LocalStorageUtils.getItem(LocalStorageKeys.CART_GIFTS) || '[]'
    );
    setCartGifts(cartGifts);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProductsByDataFromLocalStorage = useCallback(async () => {
    const cartProducts: CartProduct[] = JSON.parse(
      LocalStorageUtils.getItem(LocalStorageKeys.CART_PRODUCTS) || '[]'
    );
    const cartGifts: CartGift[] = JSON.parse(
      LocalStorageUtils.getItem(LocalStorageKeys.CART_GIFTS) || '[]'
    );

    const productIds = [
      ...cartProducts.map((cartProduct) => cartProduct.product?.key || ''),
      ...cartGifts.flatMap(
        (cartGift) =>
          cartGift.giftPromotion?.policies?.map((policy) => policy.prodId) || []
      ),
    ];

    try {
      setloadingCartProducts(true);
      const productClient = new ProductClient(null, {});
      const products = await productClient.getProducts({
        page: 1,
        pageSize: 100,
        filterByIds: productIds,
      });

      const newCartProducts = cartProducts.map((cartProduct) => {
        const product = products.data?.data.find(
          (product) => product.key === cartProduct.product?.key
        );
        return {
          ...cartProduct,
          product: product || cartProduct.product,
        };
      });

      const newCartGifts = cartGifts.map((cartGift) => {
        const newPolicy = cartGift.giftPromotion?.policies?.map((policy) => {
          const product = products.data?.data.find(
            (product) => product.key === policy.prodId
          );
          return {
            ...policy,
            product: product,
          };
        });

        return {
          ...cartGift,
          giftPromotion: {
            ...cartGift.giftPromotion,
            policy: newPolicy,
          },
        };
      });
      setCartProducts(newCartProducts);
      setCartGifts(newCartGifts);
    } catch (error) {
      console.error(
        'Error while loading cart products by data from local storage',
        error
      );
    } finally {
      setloadingCartProducts(false);
    }
  }, []);

  const addComboToCart = useCallback(
    (payload: CartCombo) => {
      const existedInCartCombo = cartCombos.find(
        (cartCombo) =>
          cartCombo.comboPromotion?.key === payload.comboPromotion?.key
      );

      if (existedInCartCombo) {
        const newCartCombos = cartCombos.map((cartCombo) => {
          if (cartCombo.comboPromotion?.key === payload.comboPromotion?.key) {
            return {
              ...cartCombo,
              quantity: payload.quantity,
            };
          }
          return cartCombo;
        });
        setCartCombos(newCartCombos);
        LocalStorageUtils.setItem(
          LocalStorageKeys.CART_COMBOS,
          JSON.stringify(newCartCombos)
        );
        return;
      } else {
        setRecentAddedToCartType('combo');
        const newCartCombos = [...cartCombos, { ...payload }];
        setCartCombos(newCartCombos);
        LocalStorageUtils.setItem(
          LocalStorageKeys.CART_COMBOS,
          JSON.stringify(newCartCombos)
        );
        return;
      }
    },
    [cartCombos]
  );

  const addDealToCart = useCallback(
    (payload: CartDeal) => {
      const existedInCartDeal = cartDeals.find(
        (cartDeal) => cartDeal.dealPromotion?.key === payload.dealPromotion?.key
      );

      if (existedInCartDeal) {
        const newCartDeals = cartDeals.map((cartDeal) => {
          if (cartDeal.dealPromotion?.key === payload.dealPromotion?.key) {
            return {
              ...cartDeal,
              quantity: payload.quantity,
            };
          }
          return cartDeal;
        });
        setCartDeals(newCartDeals);
        LocalStorageUtils.setItem(
          LocalStorageKeys.CART_DEALS,
          JSON.stringify(newCartDeals)
        );
        return;
      } else {
        setRecentAddedToCartType('deal');
        const newCartDeals = [...cartDeals, { ...payload }];
        setCartDeals(newCartDeals);
        LocalStorageUtils.setItem(
          LocalStorageKeys.CART_DEALS,
          JSON.stringify(newCartDeals)
        );
        return;
      }
    },
    [cartDeals]
  );

  const addGiftToCart = useCallback(
    (payload: CartGift) => {
      const existedInCartGift = cartGifts.find(
        (cartGift) => cartGift.giftPromotion?.key === payload.giftPromotion?.key
      );

      if (existedInCartGift) {
        const newCartGifts = cartGifts.map((cartGift) => {
          if (cartGift.giftPromotion?.key === payload.giftPromotion?.key) {
            return {
              ...cartGift,
              quantity: payload.quantity,
            };
          }
          return cartGift;
        });
        setCartGifts(newCartGifts);
        LocalStorageUtils.setItem(
          LocalStorageKeys.CART_GIFTS,
          JSON.stringify(newCartGifts)
        );
        return;
      } else {
        setRecentAddedToCartType('gift');
        const newCartGifts = [...cartGifts, { ...payload }];
        setCartGifts(newCartGifts);
        LocalStorageUtils.setItem(
          LocalStorageKeys.CART_GIFTS,
          JSON.stringify(newCartGifts)
        );
        return;
      }
    },
    [cartGifts]
  );

  const addProductToCart = useCallback(
    (payload: Omit<CartProduct, 'choosen'>) => {
      const existedInCartProduct = cartProducts.find(
        (cartProduct) => cartProduct.product?.key === payload.product?.key
      );
      if (existedInCartProduct) {
        // recalculate final price
        const newCartProducts = cartProducts.map((cartProduct) => {
          // calculate final price
          if (cartProduct.product?.key === payload.product?.key) {
            const finalPrice = payload.product?.promotions?.length
              ? (payload.product.retailPrice || 0) *
                (1 -
                  (getLargestMatchedMinConditionProduct(
                    payload.product.promotions,
                    payload.quantity
                  )?.val || 0))
              : payload.product?.retailPrice || 0;

            return {
              ...cartProduct,
              quantity: payload.quantity,
              choosen: true,
              finalPrice: finalPrice,
            };
          }

          return cartProduct;
        });

        setCartProducts(newCartProducts);
        LocalStorageUtils.setItem(
          LocalStorageKeys.CART_PRODUCTS,
          JSON.stringify(newCartProducts)
        );
        return;
      } else {
        setRecentAddedToCartType('product');
        const finalPrice = payload.product?.promotions?.length
          ? (payload.product.retailPrice || 0) *
            (1 -
              (getLargestMatchedMinConditionProduct(
                payload.product.promotions,
                payload.quantity
              )?.val || 0))
          : payload.product?.retailPrice || 0;

        const newCartProducts = [
          ...cartProducts,
          { ...payload, choosen: true, finalPrice },
        ];

        setCartProducts(newCartProducts);
        LocalStorageUtils.setItem(
          LocalStorageKeys.CART_PRODUCTS,
          JSON.stringify(newCartProducts)
        );
        return;
      }
    },
    [cartProducts]
  );

  const totalItems =
    cartProducts.length +
    cartCombos.length +
    cartDeals.length +
    cartGifts.length;

  const addToCart = useCallback(
    (payload: Omit<CartProduct, 'choosen'>) => {
      if (totalItems > 100) {
        setConfirmData({
          title: 'Giỏ hàng đã đầy',
          content:
            'Bạn không thể thêm sản phẩm vào giỏ hàng. Hãy kiểm tra lại giỏ hàng của bạn và thanh toán hoặc xóa bớt sản phẩm để tiếp tục mua sắm.',
          okText: 'Đã hiểu',
          cancelButtonProps: {
            hidden: true,
          },
        });
        return;
      }

      if (payload.comboPromotion) {
        addComboToCart({
          comboPromotion: payload.comboPromotion,
          quantity: payload.quantity,
          choosen: true,
        });
      }

      if (payload.dealPromotion) {
        addDealToCart({
          dealPromotion: payload.dealPromotion,
          quantity: payload.quantity,
          choosen: true,
        });
      }

      if (payload.giftPromotion) {
        addGiftToCart({
          giftPromotion: payload.giftPromotion,
          quantity: payload.quantity,
          choosen: true,
        });
      }

      if (payload.product) {
        addProductToCart(payload);
      }
    },
    [
      addComboToCart,
      addDealToCart,
      addGiftToCart,
      addProductToCart,
      setConfirmData,
      totalItems,
    ]
  );

  const _onRemoveProductFromCart = useCallback(
    (product?: Product) => {
      const newCartProducts = cartProducts.filter(
        (cartProduct) => cartProduct.product?.key !== product?.key
      );

      setCartProducts(newCartProducts);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_PRODUCTS,
        JSON.stringify(newCartProducts)
      );
    },
    [cartProducts]
  );

  const _onRemoveComboFromCart = useCallback(
    (comboPromotion?: ComboPromotionModel) => {
      const newCartCombos = cartCombos.filter(
        (cartCombo) => cartCombo.comboPromotion?.key !== comboPromotion?.key
      );

      setCartCombos(newCartCombos);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_COMBOS,
        JSON.stringify(newCartCombos)
      );
    },
    [cartCombos]
  );

  const _onRemoveDealFromCart = useCallback(
    (dealPromotion?: DealPromotionModel) => {
      const newCartDeals = cartDeals.filter(
        (cartDeal) => cartDeal.dealPromotion?.key !== dealPromotion?.key
      );

      setCartDeals(newCartDeals);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_DEALS,
        JSON.stringify(newCartDeals)
      );
    },
    [cartDeals]
  );

  const _onRemoveGiftFromCart = useCallback(
    (giftPromotion?: GiftPromotionModel) => {
      const newCartGifts = cartGifts.filter(
        (cartGift) => cartGift.giftPromotion?.key !== giftPromotion?.key
      );

      setCartGifts(newCartGifts);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_GIFTS,
        JSON.stringify(newCartGifts)
      );
    },
    [cartGifts]
  );

  const _onRemoveCombosFromCart = useCallback(
    (comboPromotions?: ComboPromotionModel[]) => {
      const newCartCombos = cartCombos.filter(
        (cartCombo) =>
          !comboPromotions?.some(
            (comboPromotion) =>
              comboPromotion.key === cartCombo.comboPromotion?.key
          )
      );

      setCartCombos(newCartCombos);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_COMBOS,
        JSON.stringify(newCartCombos)
      );
    },
    [cartCombos]
  );

  const _onRemoveDealsFromCart = useCallback(
    (dealPromotions?: DealPromotionModel[]) => {
      const newCartDeals = cartDeals.filter(
        (cartDeal) =>
          !dealPromotions?.some(
            (dealPromotion) => dealPromotion.key === cartDeal.dealPromotion?.key
          )
      );

      setCartDeals(newCartDeals);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_DEALS,
        JSON.stringify(newCartDeals)
      );
    },
    [cartDeals]
  );

  const _onRemoveGiftsFromCart = useCallback(
    (giftPromotions?: GiftPromotionModel[]) => {
      const newCartGifts = cartGifts.filter(
        (cartGift) =>
          !giftPromotions?.some(
            (giftPromotion) => giftPromotion.key === cartGift.giftPromotion?.key
          )
      );

      setCartGifts(newCartGifts);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_GIFTS,
        JSON.stringify(newCartGifts)
      );
    },
    [cartGifts]
  );

  const _onRemoveFromCart = useCallback(
    ({
      product,
      comboPromotion,
      dealPromotion,
      giftPromotion,
      comboPromotions,
      dealPromotions,
      giftPromotions,
    }: {
      product?: Product;
      comboPromotion?: ComboPromotionModel;
      dealPromotion?: DealPromotionModel;
      giftPromotion?: GiftPromotionModel;
      comboPromotions?: ComboPromotionModel[];
      dealPromotions?: DealPromotionModel[];
      giftPromotions?: GiftPromotionModel[];
    }) => {
      if (comboPromotion) {
        _onRemoveComboFromCart(comboPromotion);
      }
      if (dealPromotion) {
        _onRemoveDealFromCart(dealPromotion);
      }
      if (giftPromotion) {
        _onRemoveGiftFromCart(giftPromotion);
      }
      if (comboPromotions) {
        _onRemoveCombosFromCart(comboPromotions);
      }
      if (dealPromotions) {
        _onRemoveDealsFromCart(dealPromotions);
      }
      if (giftPromotions) {
        _onRemoveGiftsFromCart(giftPromotions);
      }
      if (product) {
        _onRemoveProductFromCart(product);
      }
    },
    [
      _onRemoveComboFromCart,
      _onRemoveCombosFromCart,
      _onRemoveDealFromCart,
      _onRemoveDealsFromCart,
      _onRemoveGiftFromCart,
      _onRemoveGiftsFromCart,
      _onRemoveProductFromCart,
    ]
  );

  const removeFromCart = useCallback(
    (
      payload: {
        product?: Product;
        comboPromotion?: ComboPromotionModel;
        dealPromotion?: DealPromotionModel;
        giftPromotion?: GiftPromotionModel;
        comboPromotions?: ComboPromotionModel[];
        dealPromotions?: DealPromotionModel[];
        giftPromotions?: GiftPromotionModel[];
      },
      options: {
        isShowConfirm?: boolean;
      } = {
        isShowConfirm: true,
      }
    ) => {
      if (options?.isShowConfirm) {
        setConfirmData({
          title: 'Xóa khỏi giỏ hàng',
          content: 'Danh mục này sẽ được loại bỏ khỏi giỏ hàng của bạn',
          onOk: () => {
            _onRemoveFromCart(payload);
          },
        });
      } else {
        _onRemoveFromCart(payload);
      }
    },
    [_onRemoveFromCart, setConfirmData]
  );

  const _chooseAllCartProducts = useCallback(
    (choosen: boolean) => {
      const newCartProducts = cartProducts.map((cartProduct) => {
        return {
          ...cartProduct,
          choosen: choosen,
        };
      });
      setCartProducts(newCartProducts);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_PRODUCTS,
        JSON.stringify(newCartProducts)
      );
    },
    [cartProducts]
  );

  const _chooseAllCartCombos = useCallback(
    (choosen: boolean) => {
      const newCartCombos = cartCombos.map((cartCombo) => {
        return {
          ...cartCombo,
          choosen: choosen,
        };
      });

      setCartCombos(newCartCombos);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_COMBOS,
        JSON.stringify(newCartCombos)
      );
    },
    [cartCombos]
  );

  const _chooseAllCartDeals = useCallback(
    (choosen: boolean) => {
      const newCartDeals = cartDeals.map((cartDeal) => {
        return {
          ...cartDeal,
          choosen: choosen,
        };
      });

      setCartDeals(newCartDeals);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_DEALS,
        JSON.stringify(newCartDeals)
      );
    },
    [cartDeals]
  );

  const _chooseAllCartGifts = useCallback(
    (choosen: boolean) => {
      const newCartGifts = cartGifts.map((cartGift) => {
        return {
          ...cartGift,
          choosen: choosen,
        };
      });

      setCartGifts(newCartGifts);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_GIFTS,
        JSON.stringify(newCartGifts)
      );
    },
    [cartGifts]
  );

  const setChoosenAllCart = useCallback(
    (choosen: boolean) => {
      _chooseAllCartProducts(choosen);
      _chooseAllCartCombos(choosen);
      _chooseAllCartDeals(choosen);
      _chooseAllCartGifts(choosen);
    },
    [
      _chooseAllCartCombos,
      _chooseAllCartDeals,
      _chooseAllCartGifts,
      _chooseAllCartProducts,
    ]
  );

  const _changeCartComboData = useCallback(
    (
      {
        comboPromotion,
      }: {
        comboPromotion?: ComboPromotionModel;
      },
      payload: CartChangeProductData
    ) => {
      const newCartCombos = cartCombos.map((cartCombo) => {
        if (cartCombo.comboPromotion?.key === comboPromotion?.key) {
          return {
            ...cartCombo,
            [payload.field]: payload.value,
          };
        }
        return cartCombo;
      });

      setCartCombos(newCartCombos);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_COMBOS,
        JSON.stringify(newCartCombos)
      );

      return;
    },
    [cartCombos]
  );

  const _changeCartDealData = useCallback(
    (
      {
        dealPromotion,
      }: {
        dealPromotion?: DealPromotionModel;
      },
      payload: CartChangeProductData
    ) => {
      const newCartDeals = cartDeals.map((cartDeal) => {
        if (cartDeal.dealPromotion?.key === dealPromotion?.key) {
          return {
            ...cartDeal,
            [payload.field]: payload.value,
          };
        }
        return cartDeal;
      });

      setCartDeals(newCartDeals);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_DEALS,
        JSON.stringify(newCartDeals)
      );

      return;
    },
    [cartDeals]
  );

  const _changeCartGiftData = useCallback(
    (
      {
        giftPromotion,
      }: {
        giftPromotion?: GiftPromotionModel;
      },
      payload: CartChangeProductData
    ) => {
      const newCartGifts = cartGifts.map((cartGift) => {
        if (cartGift.giftPromotion?.key === giftPromotion?.key) {
          return {
            ...cartGift,
            [payload.field]: payload.value,
          };
        }
        return cartGift;
      });

      setCartGifts(newCartGifts);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_GIFTS,
        JSON.stringify(newCartGifts)
      );

      return;
    },
    [cartGifts]
  );

  const _changeCartProductData = useCallback(
    (
      {
        product,
      }: {
        product?: Product;
      },
      payload: CartChangeProductData
    ) => {
      const newCartProducts = cartProducts.map((cartProduct) => {
        if (cartProduct.product?.key === product?.key) {
          return {
            ...cartProduct,
            [payload.field]: payload.value,
          };
        }
        return cartProduct;
      });

      setCartProducts(newCartProducts);
      LocalStorageUtils.setItem(
        LocalStorageKeys.CART_PRODUCTS,
        JSON.stringify(newCartProducts)
      );

      return;
    },
    [cartProducts]
  );

  const changeCartItemData = useCallback(
    (
      {
        comboPromotion,
        product,
        dealPromotion,
        giftPromotion,
      }: {
        comboPromotion?: ComboPromotionModel;
        product?: Product;
        dealPromotion?: DealPromotionModel;
        giftPromotion?: GiftPromotionModel;
      },
      payload: CartChangeProductData
    ) => {
      if (comboPromotion) {
        _changeCartComboData({ comboPromotion }, payload);
      }

      if (dealPromotion) {
        _changeCartDealData({ dealPromotion }, payload);
      }

      if (giftPromotion) {
        _changeCartGiftData({ giftPromotion }, payload);
      }

      if (product) {
        _changeCartProductData({ product }, payload);
      }
    },
    [
      _changeCartComboData,
      _changeCartDealData,
      _changeCartGiftData,
      _changeCartProductData,
    ]
  );

  const removeAllChosenCartItems = useCallback(() => {
    const newCartProducts = cartProducts.filter(
      (cartProduct) => !cartProduct.choosen
    );

    setCartProducts(newCartProducts);
    LocalStorageUtils.setItem(
      LocalStorageKeys.CART_PRODUCTS,
      JSON.stringify(newCartProducts)
    );

    const newCartCombos = cartCombos.filter((cartCombo) => !cartCombo.choosen);
    setCartCombos(newCartCombos);
    LocalStorageUtils.setItem(
      LocalStorageKeys.CART_COMBOS,
      JSON.stringify(newCartCombos)
    );

    const newCartDeals = cartDeals.filter((cartDeal) => !cartDeal.choosen);
    setCartDeals(newCartDeals);
    LocalStorageUtils.setItem(
      LocalStorageKeys.CART_DEALS,
      JSON.stringify(newCartDeals)
    );

    const newCartGifts = cartGifts.filter((cartGift) => !cartGift.choosen);
    setCartGifts(newCartGifts);
    LocalStorageUtils.setItem(
      LocalStorageKeys.CART_GIFTS,
      JSON.stringify(newCartGifts)
    );
  }, [cartCombos, cartDeals, cartGifts, cartProducts]);

  useEffect(() => {
    if (recentAddedToCartType) {
      // interval to hidden after 3s
      showPopupIntervalRef.current = setInterval(() => {
        setRecentAddedToCartType('');
      }, 3000);

      return () => {
        if (showPopupIntervalRef.current)
          clearInterval(showPopupIntervalRef.current);
      };
    }
  }, [recentAddedToCartType]);

  /**
   * Stop all popup when change route
   */
  useEffect(() => {
    if (showPopupIntervalRef.current) {
      setRecentAddedToCartType('');
      clearInterval(showPopupIntervalRef.current);
    }
  }, [router.asPath]);

  const isOpenNotification = useMemo(() => {
    return !!recentAddedToCartType;
  }, [recentAddedToCartType]);

  return (
    <CartContext.Provider
      value={{
        totalPrice,
        cartProducts,
        cartCombos,
        cartDeals,
        cartGifts,

        addToCart,
        removeFromCart,

        changeCartItemData,
        setChoosenAllCart,
        removeAllChosenCartItems,

        modeShowPopup,
        setModeShowPopup,
        recentAddedToCartType,
        isOpenNotification,

        loadingProductsByDataFromLocalStorage,
        loadProductsByDataFromLocalStorage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);

  //   if (context === undefined) {
  //     throw new Error('__void');
  //   }

  return context;
}

export default CartProvider;
