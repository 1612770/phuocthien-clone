import { Button, Input, Typography } from 'antd';
import Product from '@configs/models/product.model';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '@providers/CartProvider';
import { PromotionPercent } from '@configs/models/promotion.model';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

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
  type = 'default',
}: {
  product: Product;
  className?: string;
  promotionPercent?: PromotionPercent;
  type?: 'default' | 'in-detail';
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

  if (type === 'in-detail')
    return (
      <div onClick={(e) => e.preventDefault()} className="w-full">
        {!!productIncart && (
          <div className="flex items-center">
            {/* <Typography.Text className="mr-2 whitespace-nowrap">
              Số lượng:&nbsp;
            </Typography.Text> */}
            <div className="flex w-full items-center justify-between">
              <Input.Group
                className={`flex w-full justify-between ${'rounded-full border border-solid border-primary'}`}
                compact
              >
                <Button
                  size={'large'}
                  className={`min-w-[32px] rounded-lg  ${'rounded-tl-full rounded-bl-full'} border-none bg-green-50 disabled:bg-gray-50`}
                  icon={<MinusOutlined size={20} className="text-primary" />}
                  disabled={productIncart.quantity <= 0}
                  onClick={(e) => {
                    e.preventDefault();
                    if ((productIncart?.quantity || 0) > 0) {
                      updateCartQuantity((productIncart?.quantity || 1) - 1);
                    }
                  }}
                />
                <Input
                  size={'large'}
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
                  size={'large'}
                  className={`h-[42px] min-w-[32px] rounded-lg ${'rounded-tr-full rounded-br-full'} border-none bg-green-50 disabled:bg-gray-50`}
                  disabled={productIncart.quantity >= 1000}
                  icon={<PlusOutlined size={20} className="text-primary" />}
                  onClick={(e) => {
                    e.preventDefault();
                    updateCartQuantity((productIncart?.quantity || 0) + 1);
                  }}
                />
              </Input.Group>
            </div>
          </div>
        )}

        {!productIncart && (
          <Button
            disabled={!product.retailPrice}
            className={`px-4 shadow-none ${className} ${
              !product.retailPrice
                ? 'bg-gray-100 hover:bg-gray-100 group-hover:border-gray-100 group-hover:bg-gray-100 group-hover:text-gray-800 '
                : ''
            }`}
            type="primary"
            shape={'round'}
            size={'large'}
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

  return (
    <div onClick={(e) => e.preventDefault()} className="w-full">
      {!!productIncart && (
        <div className="flex w-full items-center justify-between">
          <Input.Group className="flex w-full justify-between" compact>
            <Button
              className="min-w-[32px] rounded-lg border-none bg-green-50 disabled:bg-gray-50"
              icon={<MinusOutlined className="text-primary" />}
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
              icon={<PlusOutlined className="text-primary" />}
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
          disabled={!product.retailPrice}
          className={`px-4 shadow-none ${className} ${
            !product.retailPrice
              ? 'bg-gray-100 hover:bg-gray-100 group-hover:border-gray-100 group-hover:bg-gray-100 group-hover:text-gray-800 '
              : ''
          }`}
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
