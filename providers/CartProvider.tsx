import Product, { CartProduct } from '@configs/models/product.model';
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

type CartChangeProductData =
  | {
      field: 'quantity';
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

const CartContext = React.createContext<{
  cartProducts: CartProduct[];
  choosenCartProducts: CartProduct[];
  addToCart: (payload: Omit<CartProduct, 'choosen'>) => void;
  removeFromCart: (
    product: Product,
    options?: {
      isShowConfirm?: boolean;
    }
  ) => void;
  changeProductData: (product: Product, payload: CartChangeProductData) => void;
  setChoosenAllCartProducts: (choosen: boolean) => void;
  removeAllChosenProducts: () => void;

  modeShowPopup: 'cart-button' | 'fixed';
  setModeShowPopup: React.Dispatch<
    React.SetStateAction<'cart-button' | 'fixed'>
  >;
  isOpenNotification: boolean;
}>({
  cartProducts: [],
  choosenCartProducts: [],
  addToCart: () => undefined,
  removeFromCart: () => undefined,
  changeProductData: () => undefined,
  setChoosenAllCartProducts: () => undefined,
  removeAllChosenProducts: () => undefined,

  modeShowPopup: 'cart-button',
  setModeShowPopup: () => undefined,
  isOpenNotification: false,
});

function CartProvider({ children }: { children: React.ReactNode }) {
  const [modeShowPopup, setModeShowPopup] = useState<'cart-button' | 'fixed'>(
    'cart-button'
  );
  const [recentAddedProductKey, setRecentAddedProductKey] = useState('');

  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  const { setConfirmData } = useAppConfirmDialog();
  const router = useRouter();
  const showPopupIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const cartProducts = JSON.parse(
      LocalStorageUtils.getItem(LocalStorageKeys.CART_PRODUCTS) || '[]'
    );
    setCartProducts(cartProducts);
  }, []);

  const addToCart = useCallback(
    (payload: Omit<CartProduct, 'choosen'>) => {
      if (
        cartProducts.find(
          (cartProduct) => cartProduct.product.key === payload.product.key
        )
      ) {
        const newCartProducts = cartProducts.map((cartProduct) => {
          if (cartProduct.product.key === payload.product.key) {
            return {
              ...cartProduct,
              quantity: payload.quantity,
              choosen: true,
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
        setRecentAddedProductKey(payload.product.key || '');
        const newCartProducts = [
          ...cartProducts,
          { ...payload, choosen: true },
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

  const removeFromCart = useCallback(
    (
      product: Product,
      options: {
        isShowConfirm?: boolean;
      } = {
        isShowConfirm: true,
      }
    ) => {
      if (options?.isShowConfirm) {
        setConfirmData({
          title: 'Xóa khỏi giỏ hàng',
          content: 'Sản phẩm này sẽ được loại bỏ khỏi giỏ hàng của bạn',
          onOk: () => {
            const newCartProducts = cartProducts.filter(
              (cartProduct) => cartProduct.product.key !== product.key
            );
            setCartProducts(newCartProducts);
            LocalStorageUtils.setItem(
              LocalStorageKeys.CART_PRODUCTS,
              JSON.stringify(newCartProducts)
            );
          },
        });
      } else {
        const newCartProducts = cartProducts.filter(
          (cartProduct) => cartProduct.product.key !== product.key
        );
        setCartProducts(newCartProducts);
        LocalStorageUtils.setItem(
          LocalStorageKeys.CART_PRODUCTS,
          JSON.stringify(newCartProducts)
        );
      }
    },
    [cartProducts, setConfirmData]
  );

  const setChoosenAllCartProducts = useCallback(
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

  const changeProductData = useCallback(
    (product: Product, payload: CartChangeProductData) => {
      const newCartProducts = cartProducts.map((cartProduct) => {
        if (cartProduct.product.key === product.key) {
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
    },
    [cartProducts]
  );

  const removeAllChosenProducts = useCallback(() => {
    const newCartProducts = cartProducts.filter(
      (cartProduct) => !cartProduct.choosen
    );

    setCartProducts(newCartProducts);

    LocalStorageUtils.setItem(
      LocalStorageKeys.CART_PRODUCTS,
      JSON.stringify(newCartProducts)
    );
  }, [cartProducts]);

  const choosenCartProducts = useMemo(
    () => cartProducts.filter((cartProduct) => cartProduct.choosen),
    [cartProducts]
  );

  useEffect(() => {
    if (recentAddedProductKey) {
      // interval to hidden after 3s
      showPopupIntervalRef.current = setInterval(() => {
        setRecentAddedProductKey('');
      }, 3000);

      return () => {
        if (showPopupIntervalRef.current)
          clearInterval(showPopupIntervalRef.current);
      };
    }
  }, [recentAddedProductKey]);

  /**
   * Stop all popup when change route
   */
  useEffect(() => {
    if (showPopupIntervalRef.current) {
      setRecentAddedProductKey('');
      clearInterval(showPopupIntervalRef.current);
    }
  }, [router.asPath]);

  const isOpenNotification = useMemo(() => {
    return !!recentAddedProductKey;
  }, [recentAddedProductKey]);

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        choosenCartProducts,
        addToCart,
        removeFromCart,
        changeProductData,
        setChoosenAllCartProducts,
        removeAllChosenProducts,

        modeShowPopup,
        setModeShowPopup,
        isOpenNotification,
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
