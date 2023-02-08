import Product from '@configs/models/product.model';
import LocalStorageUtils, {
  LocalStorageKeys,
} from '@libs/utils/local-storage.utils';
import { Button, notification } from 'antd';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppConfirmDialog } from './AppConfirmDialogProvider';

const CartContext = React.createContext<{
  cartProducts: { product: Product; quantity: number; note?: string }[];
  addToCart: (payload: {
    product: Product;
    quantity: number;
    note?: string;
  }) => void;
  removeFromCart: (
    product: Product,
    options?: {
      isShowConfirm?: boolean;
    }
  ) => void;
  changeProductData: (
    product: Product,
    payload: { field: 'quantity' | 'note'; value: number | string }
  ) => void;
  resetCart: () => void;
}>({
  cartProducts: [],
  addToCart: () => undefined,
  removeFromCart: () => undefined,
  changeProductData: () => undefined,
  resetCart: () => undefined,
});

function CartProvider({ children }: { children: React.ReactNode }) {
  const [api, contextHolder] = notification.useNotification({
    maxCount: 1,
  });

  const [cartProducts, setCartProducts] = useState<
    { product: Product; quantity: number; note?: string }[]
  >([]);

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
  }, []);

  const addToCart = useCallback(
    (payload: { product: Product; quantity: number; note?: string }) => {
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
        const newCartProducts = [...cartProducts, payload];
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
    [cartProducts]
  );

  const changeProductData = useCallback(
    (
      product: Product,
      payload: { field: 'quantity' | 'note'; value: number | string }
    ) => {
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

  const resetCart = useCallback(() => {
    setCartProducts([]);
    LocalStorageUtils.removeItem(LocalStorageKeys.CART_PRODUCTS);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        addToCart,
        removeFromCart,
        changeProductData,
        resetCart,
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
