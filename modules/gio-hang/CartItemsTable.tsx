import CartItem from '@modules/cart/CartItem';
import { useCart } from '@providers/CartProvider';
import { useCheckout } from '@providers/CheckoutProvider';
import { Checkbox, Divider, Typography } from 'antd';
import React, { Fragment } from 'react';

function CartItemsTable() {
  const { cartProducts, cartCombos, cartDeals, cartGifts, setChoosenAllCart } =
    useCart();
  const { cartStep, checkProductBeforeCheckout } = useCheckout();

  const isAllCartProductsChoosen = cartProducts.every(
    (cartProduct) => cartProduct.choosen
  );
  const isAllCartCombosChoosen = cartCombos.every(
    (cartCombo) => cartCombo.choosen
  );
  const isAllCartDealsChoosen = cartDeals.every((cartDeal) => cartDeal.choosen);
  const isAllCartGiftsChoosen = cartGifts.every((cartGift) => cartGift.choosen);
  const isAllCartItemsChoosen =
    isAllCartProductsChoosen &&
    isAllCartCombosChoosen &&
    isAllCartDealsChoosen &&
    isAllCartGiftsChoosen;
  const cartProductsToShow =
    cartStep === 'cart'
      ? cartProducts
      : cartProducts.filter((cartCombo) => cartCombo.choosen);
  const cartCombosToShow =
    cartStep === 'cart'
      ? cartCombos
      : cartCombos.filter((cartCombo) => cartCombo.choosen);
  const cartDealsToShow =
    cartStep === 'cart'
      ? cartDeals
      : cartDeals.filter((cartDeal) => cartDeal.choosen);
  const cartGiftsToShow =
    cartStep === 'cart'
      ? cartGifts
      : cartGifts.filter((cartGift) => cartGift.choosen);

  return (
    <>
      {cartStep === 'cart' && (
        <Checkbox
          className="my-2"
          checked={isAllCartItemsChoosen}
          onClick={() => {
            setChoosenAllCart(!isAllCartItemsChoosen);
          }}
        >
          <Typography>Chọn tất cả</Typography>
        </Checkbox>
      )}

      {cartProductsToShow.map((cartProduct, index) => (
        <Fragment key={cartProduct.product?.key}>
          <CartItem
            cartProduct={cartProduct}
            checkInventory={checkProductBeforeCheckout.find(
              (el) => el.product.product?.key === cartProduct.product?.key
            )}
          />
          {index !== cartProducts.length - 1 && <Divider className="my-2" />}
        </Fragment>
      ))}

      {cartCombosToShow.map((cartCombo, index) => (
        <Fragment key={cartCombo.comboPromotion?.key}>
          <CartItem cartCombo={cartCombo} />
          {index !== cartCombosToShow.length - 1 && (
            <Divider className="my-2" />
          )}
        </Fragment>
      ))}

      {cartDealsToShow.map((cartDeal, index) => (
        <Fragment key={cartDeal.dealPromotion?.key}>
          <CartItem cartDeal={cartDeal} />
          {index !== cartDealsToShow.length - 1 && <Divider className="my-2" />}
        </Fragment>
      ))}

      {cartGiftsToShow.map((cartGift, index) => (
        <Fragment key={cartGift.giftPromotion?.key}>
          <CartItem cartGift={cartGift} />
          {index !== cartGiftsToShow.length - 1 && <Divider className="my-2" />}
        </Fragment>
      ))}
    </>
  );
}

export default CartItemsTable;
