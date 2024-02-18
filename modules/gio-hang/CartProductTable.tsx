import CartProductItem from '@modules/cart/CartProductItem';
import { useCart } from '@providers/CartProvider';
import { useCheckout } from '@providers/CheckoutProvider';
import { Divider, Radio, Typography } from 'antd';
import React, { Fragment } from 'react';

function CartProductTable() {
  const { cartProducts, choosenCartProducts, setChoosenAllCartProducts } =
    useCart();
  const { cartStep, checkProductBeforeCheckout } = useCheckout();

  const isAllCartProductsChoosen = cartProducts.every(
    (cartProduct) => cartProduct.choosen
  );
  const cartProductsToShow =
    cartStep === 'cart' ? cartProducts : choosenCartProducts;
  return (
    <>
      {cartStep === 'cart' && (
        <Radio
          className="my-2"
          checked={isAllCartProductsChoosen}
          onClick={() => {
            setChoosenAllCartProducts(!isAllCartProductsChoosen);
          }}
        >
          <Typography>Chọn tất cả</Typography>
        </Radio>
      )}

      {cartProductsToShow.map((cartProduct, index) => (
        <Fragment key={cartProduct.product.key}>
          <CartProductItem
            cartProduct={cartProduct}
            checkInventory={checkProductBeforeCheckout.find(
              (el) => el.product.product.key === cartProduct.product.key
            )}
          />
          {index !== cartProducts.length - 1 && <Divider className="my-2" />}
        </Fragment>
      ))}
    </>
  );
}

export default CartProductTable;
