import Product, { CartProduct } from '@configs/models/product.model';
import LocalStorageUtils, {
  LocalStorageKeys,
} from '@libs/utils/local-storage.utils';
import { Button, notification } from 'antd';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppConfirmDialog } from './AppConfirmDialogProvider';

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
}>({
  cartProducts: [],
  choosenCartProducts: [],
  addToCart: () => undefined,
  removeFromCart: () => undefined,
  changeProductData: () => undefined,
  setChoosenAllCartProducts: () => undefined,
  removeAllChosenProducts: () => undefined,
});

function CartProvider({ children }: { children: React.ReactNode }) {
  const [api, contextHolder] = notification.useNotification({
    maxCount: 1,
  });

  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  const { setConfirmData } = useAppConfirmDialog();

  useEffect(() => {
    const cartProducts = JSON.parse(
      LocalStorageUtils.getItem(LocalStorageKeys.CART_PRODUCTS) || '[]'
    );
    setCartProducts(cartProducts);
  }, []);

  const openNotification = useCallback(() => {
    const key = `open${Date.now()}`;
    const action = (
      <Link href="/gio-hang">
        <a>
          <Button type="link" size="small" onClick={() => api.destroy()}>
            Đi tới giỏ hàng
          </Button>
        </a>
      </Link>
    );

    api.open({
      message: '',
      type: 'success',
      description: 'Thêm sản phẩm vào giỏ hàng thành công',
      btn: action,
      placement: 'bottomRight',
      key,
    });
  }, [api]);

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
        openNotification();
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
    [cartProducts, openNotification]
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
      }}
    >
      {contextHolder}
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
