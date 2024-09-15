import { Button, Input } from 'antd';
import Product from '@configs/models/product.model';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '@providers/CartProvider';
import {
  ComboPromotionModel,
  DealPromotionModel,
  GiftPromotionModel,
  PromotionPercent,
} from '@configs/models/promotion.model';
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
  comboPromotion,
  dealPromotion,
  giftPromotion,
  label = 'Chọn mua',
  type = 'default',
}: {
  product?: Product;
  className?: string;
  promotionPercent?: PromotionPercent;
  comboPromotion?: ComboPromotionModel & { images: string[] };
  dealPromotion?: DealPromotionModel;
  giftPromotion?: GiftPromotionModel;
  label?: string;
  type?: 'default' | 'in-detail';
}) {
  const {
    addToCart,
    cartProducts,
    cartCombos,
    cartDeals,
    cartGifts,
    removeFromCart,
  } = useCart();

  const [quantity, setQuantity] = useState(0);

  const lastestPositiveQuantityRef = useRef<number>();
  const { setConfirmData } = useAppConfirmDialog();

  const productIncart = useMemo(
    () =>
      product
        ? cartProducts.find(
            (cartProduct) => cartProduct.product?.key === product?.key
          )
        : undefined,
    [cartProducts, product]
  );

  const comboIncart = useMemo(
    () =>
      comboPromotion
        ? cartCombos.find(
            (cartCombo) => cartCombo.comboPromotion?.key === comboPromotion?.key
          )
        : undefined,
    [cartCombos, comboPromotion]
  );

  const dealIncart = useMemo(
    () =>
      dealPromotion
        ? cartDeals.find(
            (cartDeal) => cartDeal.dealPromotion?.key === dealPromotion?.key
          )
        : undefined,
    [cartDeals, dealPromotion]
  );

  const giftIncart = useMemo(
    () =>
      giftPromotion
        ? cartGifts.find(
            (cartGift) => cartGift.giftPromotion?.key === giftPromotion?.key
          )
        : undefined,
    [cartGifts, giftPromotion]
  );

  const updateCartQuantityForCombo = (quantity: number) => {
    setQuantity(quantity);

    if (!quantity) {
      setConfirmData({
        title: 'Xóa khỏi giỏ hàng',
        content: `Combo ${comboPromotion?.name} sẽ được loại bỏ khỏi giỏ hàng của bạn?`,
        onOk: () => {
          removeFromCart(
            { comboPromotion },
            {
              isShowConfirm: false,
            }
          );
        },
        onCancel: () => {
          setQuantity(lastestPositiveQuantityRef.current || 0);
        },
      });
    } else {
      lastestPositiveQuantityRef.current = quantity;
      addToCart({
        comboPromotion,
        quantity,
      });
    }
  };

  const updateCartQuantityForDeal = (quantity: number) => {
    setQuantity(quantity);

    if (!quantity) {
      setConfirmData({
        title: 'Xóa khỏi giỏ hàng',
        content: `Deal #${dealPromotion?.key} sẽ được loại bỏ khỏi giỏ hàng của bạn?`,
        onOk: () => {
          removeFromCart(
            { dealPromotion },
            {
              isShowConfirm: false,
            }
          );
        },
        onCancel: () => {
          setQuantity(lastestPositiveQuantityRef.current || 0);
        },
      });
    } else {
      lastestPositiveQuantityRef.current = quantity;
      addToCart({
        dealPromotion,
        quantity,
      });
    }
  };

  const updateCartQuantityForGift = (quantity: number) => {
    setQuantity(quantity);

    if (!quantity) {
      setConfirmData({
        title: 'Xóa khỏi giỏ hàng',
        content: `Gift #${giftPromotion?.key} sẽ được loại bỏ khỏi giỏ hàng của bạn?`,
        onOk: () => {
          removeFromCart(
            { giftPromotion },
            {
              isShowConfirm: false,
            }
          );
        },
        onCancel: () => {
          setQuantity(lastestPositiveQuantityRef.current || 0);
        },
      });
    } else {
      lastestPositiveQuantityRef.current = quantity;
      addToCart({
        giftPromotion,
        quantity,
      });
    }
  };

  const updateCartQuantity = (quantity: number) => {
    setQuantity(quantity);

    if (comboIncart) {
      updateCartQuantityForCombo(quantity);
      return;
    }

    if (dealIncart) {
      updateCartQuantityForDeal(quantity);
      return;
    }

    if (giftIncart) {
      updateCartQuantityForGift(quantity);
      return;
    }

    if (!quantity) {
      setConfirmData({
        title: 'Xóa khỏi giỏ hàng',
        content: `Sản phẩm ${
          product?.detail?.displayName || product?.name
        } sẽ được loại bỏ khỏi giỏ hàng của bạn?`,
        onOk: () => {
          removeFromCart(
            { product },
            {
              isShowConfirm: false,
            }
          );
        },
        onCancel: () => {
          setQuantity(lastestPositiveQuantityRef.current || 0);
        },
      });
    } else {
      lastestPositiveQuantityRef.current = quantity;
      addToCart({
        product: product
          ? putPromotionIntoNonPromotionProduct(product, promotionPercent)
          : undefined,
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

  useEffect(() => {
    if (comboIncart?.quantity) {
      setQuantity(comboIncart.quantity);
      lastestPositiveQuantityRef.current = comboIncart.quantity;
    }
  }, [comboIncart?.quantity]);

  useEffect(() => {
    if (dealIncart?.quantity) {
      setQuantity(dealIncart.quantity);
      lastestPositiveQuantityRef.current = dealIncart.quantity;
    }
  }, [dealIncart?.quantity]);

  useEffect(() => {
    if (giftIncart?.quantity) {
      setQuantity(giftIncart.quantity);
      lastestPositiveQuantityRef.current = giftIncart.quantity;
    }
  }, [giftIncart?.quantity]);

  const isButtonDisabled =
    product &&
    !product?.retailPrice &&
    !comboPromotion &&
    !dealPromotion &&
    !giftPromotion;
  const shouldShowQuantity =
    !!productIncart || !!comboIncart || !!dealIncart || !!giftIncart;

  const onMinusClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if ((comboIncart?.quantity || 0) > 0) {
      updateCartQuantity((comboIncart?.quantity || 1) - 1);
      return;
    }

    if ((dealIncart?.quantity || 0) > 0) {
      updateCartQuantity((dealIncart?.quantity || 1) - 1);
      return;
    }

    if ((giftIncart?.quantity || 0) > 0) {
      updateCartQuantity((giftIncart?.quantity || 1) - 1);
      return;
    }

    updateCartQuantity((productIncart?.quantity || 1) - 1);
  };

  const onPlusClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if ((comboIncart?.quantity || 0) > 0) {
      updateCartQuantity((comboIncart?.quantity || 0) + 1);
      return;
    }

    if ((dealIncart?.quantity || 0) > 0) {
      updateCartQuantity((dealIncart?.quantity || 0) + 1);
      return;
    }

    if ((giftIncart?.quantity || 0) > 0) {
      updateCartQuantity((giftIncart?.quantity || 0) + 1);
      return;
    }

    updateCartQuantity((productIncart?.quantity || 0) + 1);
  };

  const isMinusDisabled = comboPromotion
    ? (comboIncart?.quantity || 0) <= 0
    : giftPromotion
    ? (giftIncart?.quantity || 0) <= 0
    : dealPromotion
    ? (dealIncart?.quantity || 0) <= 0
    : (productIncart?.quantity || 0) <= 0;

  const isPlusDisabled = comboPromotion
    ? (comboIncart?.quantity || 0) >= 1000
    : giftPromotion
    ? (giftIncart?.quantity || 0) >= 1000
    : dealPromotion
    ? (dealIncart?.quantity || 0) >= 1000
    : (productIncart?.quantity || 0) >= 1000;

  if (type === 'in-detail')
    return (
      <div onClick={(e) => e.preventDefault()} className="w-full">
        {shouldShowQuantity && (
          <div className="flex items-center">
            <div className="flex w-full items-center justify-between">
              <Input.Group
                className={`flex w-full justify-between ${'rounded-full border border-solid border-primary'}`}
                compact
              >
                <Button
                  size={'large'}
                  className={`min-w-[32px] rounded-lg  ${'rounded-tl-full rounded-bl-full'} border-none bg-green-50 disabled:bg-gray-50`}
                  icon={<MinusOutlined size={20} className="text-primary" />}
                  disabled={isMinusDisabled}
                  onClick={onMinusClick}
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
                  max={50}
                  onBlur={(e) => {
                    updateCartQuantity(+e.target.value);
                  }}
                />
                <Button
                  size={'large'}
                  className={`h-[42px] min-w-[32px] rounded-lg ${'rounded-tr-full rounded-br-full'} border-none bg-green-50 disabled:bg-gray-50`}
                  disabled={isPlusDisabled}
                  icon={<PlusOutlined size={20} className="text-primary" />}
                  onClick={onPlusClick}
                />
              </Input.Group>
            </div>
          </div>
        )}

        {!shouldShowQuantity && (
          <Button
            disabled={isButtonDisabled}
            className={`px-4 shadow-none ${className} ${
              isButtonDisabled
                ? 'bg-gray-100 hover:bg-gray-100 group-hover:border-gray-100 group-hover:bg-gray-100 group-hover:text-gray-800 '
                : ''
            }`}
            type="primary"
            shape={'round'}
            size={'large'}
            onClick={(e) => {
              e.preventDefault();

              addToCart({
                product: product
                  ? putPromotionIntoNonPromotionProduct(
                      product,
                      promotionPercent
                    )
                  : undefined,
                comboPromotion,
                dealPromotion,
                giftPromotion,
                quantity: 1,
              });
            }}
          >
            {label}
          </Button>
        )}
      </div>
    );

  return (
    <div onClick={(e) => e.preventDefault()} className="w-full">
      {shouldShowQuantity && (
        <div className="flex w-full items-center justify-between">
          <Input.Group className="flex w-full justify-between" compact>
            <Button
              className="min-w-[32px] rounded-lg border-none bg-green-50 disabled:bg-gray-50"
              icon={<MinusOutlined className="text-primary" />}
              disabled={isMinusDisabled}
              onClick={onMinusClick}
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
              max={50}
              onBlur={(e) => {
                updateCartQuantity(+e.target.value);
              }}
            />
            <Button
              className="min-w-[32px] rounded-lg border-none bg-green-50 disabled:bg-gray-50"
              disabled={isPlusDisabled}
              icon={<PlusOutlined className="text-primary" />}
              onClick={onPlusClick}
            />
          </Input.Group>
        </div>
      )}

      {!shouldShowQuantity && (
        <Button
          disabled={isButtonDisabled}
          className={`px-4 shadow-none ${className} ${
            isButtonDisabled
              ? 'bg-gray-100 hover:bg-gray-100 group-hover:border-gray-100 group-hover:bg-gray-100 group-hover:text-gray-800 '
              : ''
          }`}
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            addToCart({
              product: product
                ? putPromotionIntoNonPromotionProduct(product, promotionPercent)
                : undefined,
              comboPromotion,
              dealPromotion,
              giftPromotion,
              quantity: 1,
            });
          }}
        >
          {label}
        </Button>
      )}
    </div>
  );
}

export default AddToCartButton;
