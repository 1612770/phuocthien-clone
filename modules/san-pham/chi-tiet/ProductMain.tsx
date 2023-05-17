import { InfoCircleOutlined } from '@ant-design/icons';
import COLORS from '@configs/colors';
import OfferModel from '@configs/models/offer.model';
import Product from '@configs/models/product.model';
import { PromotionPercent } from '@configs/models/promotion.model';
import AddToCartButton from '@modules/products/AddToCartButton';
import PriceUnit from '@modules/products/PriceUnit';
import ProductBonusSection from '@modules/products/ProductBonusSection';
import ProductMetaData from '@modules/products/ProductMetaData';
import PromotionList from '@modules/products/PromotionList';
import { useCart } from '@providers/CartProvider';
import { Typography, Tag } from 'antd';
import React from 'react';

const getMaxDiscount = (promotionPercents: PromotionPercent[]): number => {
  let maxDiscount = 0;
  promotionPercents.forEach((promotion) => {
    if (promotion.val > maxDiscount) {
      maxDiscount = promotion.val;
    }
  });
  return maxDiscount;
};

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

function ProductMain({
  product,
  offers,
}: {
  product: Product;
  offers: OfferModel[];
}) {
  const { cartProducts } = useCart();

  const curProductIncart = cartProducts.find(
    (item) => item.product.key === product?.key
  );

  const maxDisCount = getMaxDiscount(product?.promotions || []);
  const nextInstruction = getInstruction(
    product?.promotions || [],
    curProductIncart?.quantity || 0
  );

  return (
    <div className="relative">
      <div className="flex flex-col">
        <Typography.Title className="mx-0 mt-2 text-2xl font-medium">
          {product?.detail?.displayName || product?.name}
        </Typography.Title>

        <ProductBonusSection offers={offers} />

        <div className="relative flex w-full flex-col flex-wrap gap-2 rounded-lg border border-solid border-gray-100 bg-white p-4 shadow-lg md:flex-nowrap lg:gap-2">
          {maxDisCount > 0 && (
            <Tag color={COLORS.red} className="absolute -top-[8px] -left-[8px]">
              Giảm {maxDisCount * 100}%
            </Tag>
          )}

          {nextInstruction && (
            <div className="flex items-center gap-2 text-blue-500">
              <InfoCircleOutlined size={12} />
              <Typography.Text className="text-inherit">
                {nextInstruction}
              </Typography.Text>
            </div>
          )}

          <div className="flex w-full flex-1 flex-wrap items-start justify-between">
            <PriceUnit
              price={product.retailPrice}
              discountVal={maxDisCount}
              unit={product.unit}
            />
            {product && (
              <div className="w-full md:w-[140px]">
                <AddToCartButton
                  product={product}
                  className="w-full uppercase"
                />
              </div>
            )}
          </div>
          {!!product.promotions?.length && (
            <PromotionList
              promotionPercents={product.promotions || []}
              retailPrice={product.retailPrice}
            />
          )}
        </div>
      </div>

      {product && <ProductMetaData product={product} />}
    </div>
  );
}

export default ProductMain;
