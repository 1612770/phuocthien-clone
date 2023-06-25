import { InfoCircleOutlined } from '@ant-design/icons';
import Product from '@configs/models/product.model';
import { useCart } from '@providers/CartProvider';
import { Grid, Typography } from 'antd';
import React, { ReactNode } from 'react';
import AddToCartButton from './AddToCartButton';
import { PromotionPercent } from '@configs/models/promotion.model';

const getNextPromotion = (
  promotionPercents: PromotionPercent[],
  currentQuantity: number
): PromotionPercent | undefined => {
  let nextPromo: PromotionPercent | undefined = undefined;

  promotionPercents.forEach((promotion) => {
    if (promotion.productQuantityMinCondition > currentQuantity) {
      nextPromo = promotion;
    }
  });

  return nextPromo;
};

const getInstruction = (
  promotionPercents: PromotionPercent[],
  currentQuantity: number
): string => {
  const nextPromo = getNextPromotion(promotionPercents, currentQuantity);

  if (!nextPromo) return '';
  return `Mua ${currentQuantity ? 'thêm' : 'ít nhất'} ${
    nextPromo.productQuantityMinCondition - currentQuantity
  } sản phẩm để được giảm ${nextPromo.val * 100}%`;
};

function ProductCTA({
  product,
  price,
}: {
  product: Product;
  price: ReactNode;
}) {
  const { cartProducts } = useCart();
  const { lg } = Grid.useBreakpoint();

  const curProductIncart = cartProducts.find(
    (item) => item.product.key === product?.key
  );
  const nextInstruction = getInstruction(
    product?.promotions || [],
    curProductIncart?.quantity || 0
  );

  return (
    <>
      <div className="mt-2 hidden flex-col gap-1 lg:flex">
        {product && (
          <div className=" w-full md:w-[200px]">
            <AddToCartButton
              type="in-detail"
              product={product}
              className="w-[200px] uppercase"
            />
          </div>
        )}

        {nextInstruction && (
          <div className="flex items-center gap-2 text-blue-500">
            <InfoCircleOutlined size={12} />
            <Typography.Text className="text-inherit">
              {nextInstruction}
            </Typography.Text>
          </div>
        )}
      </div>

      {!lg && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            height: 'auto',
            background: '#fff',
            boxShadow: '0 -2px 8px rgb(0 0 0 / 15%)',
            padding: '16px',
          }}
        >
          {nextInstruction && (
            <div className="mb-2 flex items-center gap-2 text-blue-500">
              <InfoCircleOutlined size={12} />
              <Typography.Text className="text-inherit">
                {nextInstruction}
              </Typography.Text>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            {price}

            {product && (
              <div className="w-[180px]">
                <AddToCartButton
                  type="in-detail"
                  product={product}
                  className="w-full uppercase"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCTA;
