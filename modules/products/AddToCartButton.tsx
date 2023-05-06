import { Button, Input } from 'antd';
import Product from '@configs/models/product.model';
import { Minus, Plus } from 'react-feather';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '@providers/CartProvider';
import { PromotionPercent } from '@configs/models/promotion.model';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';

const putPromotionIntoNonPromotionProduct = (
  product: Product,
  promotionPercent?: PromotionPercent
): Product => {
  if (!product.promotions && promotionPercent) {
    return {
      ...product,
      promotions: [promotionPercent],
    };
  }
  return product;
};

function AddToCartButton({
  product,
  className,
  promotionPercent,
}: {
  product: Product;
  className?: string;
  promotionPercent?: PromotionPercent;
}) {
  const { addToCart, cartProducts, removeFromCart } = useCart();

  const [quantity, setQuantity] = useState(0);
  const lastestPositiveQuantityRef = useRef<number>();
  const { setConfirmData } = useAppConfirmDialog();

  const productIncart = useMemo(
    () =>
      cartProducts.find(
        (cartProduct) => cartProduct.product.key === product.key
      ),
    [cartProducts, product.key]
  );

  const updateCartQuantity = (quantity: number) => {
    setQuantity(quantity);

    if (!quantity) {
      setConfirmData({
        title: 'Xóa khỏi giỏ hàng',
        content: `Sản phẩm ${
          product.detail?.displayName || product.name
        } sẽ được loại bỏ khỏi giỏ hàng của bạn?`,
        onOk: () => {
          removeFromCart(product, {
            isShowConfirm: false,
          });
        },
        onCancel: () => {
          setQuantity(lastestPositiveQuantityRef.current || 0);
        },
      });
    } else {
      lastestPositiveQuantityRef.current = quantity;
      addToCart({
        product: putPromotionIntoNonPromotionProduct(product, promotionPercent),
        quantity,
      });
    }
  };

  useEffect(() => {
    if (productIncart?.quantity) {
      setQuantity(productIncart.quantity);
      lastestPositiveQuantityRef.current = productIncart.quantity;
    }
  }, [productIncart?.quantity]);

  return (
    <div onClick={(e) => e.preventDefault()} className="w-full">
      {!!productIncart && (
        <div className="flex w-full items-center justify-between">
          <Input.Group className="flex w-full justify-between" compact>
            <Button
              className="min-w-[32px] rounded-lg border-none bg-green-50 disabled:bg-gray-50"
              icon={<Minus size={20} className="text-primary" />}
              disabled={productIncart.quantity <= 0}
              onClick={(e) => {
                e.preventDefault();
                if ((productIncart?.quantity || 0) > 0) {
                  updateCartQuantity((productIncart?.quantity || 1) - 1);
                }
              }}
            />
            <Input
              className="border-none text-center font-semibold outline-none focus:shadow-none focus:outline-none"
              value={quantity || ''}
              onChange={(e) => {
                e.preventDefault();
                const value = +e.target.value;
                setQuantity(value);

                // hold the latest positive value
                if (value > 0) {
                  lastestPositiveQuantityRef.current = value;
                }
              }}
              onBlur={(e) => {
                updateCartQuantity(+e.target.value);
              }}
            />
            <Button
              className="min-w-[32px] rounded-lg border-none bg-green-50 disabled:bg-gray-50"
              disabled={productIncart.quantity >= 1000}
              icon={<Plus size={20} className="text-primary" />}
              onClick={(e) => {
                e.preventDefault();
                updateCartQuantity((productIncart?.quantity || 0) + 1);
              }}
            />
          </Input.Group>
        </div>
      )}

      {!productIncart && (
        <Button
          className={`px-4 shadow-none ${className}`}
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            addToCart({
              product: putPromotionIntoNonPromotionProduct(
                product,
                promotionPercent
              ),
              quantity: 1,
            });
          }}
        >
          Chọn mua
        </Button>
      )}
    </div>
  );
}

export default AddToCartButton;
