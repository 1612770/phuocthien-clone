import COLORS from '@configs/colors';
import OfferModel from '@configs/models/offer.model';
import Product, { InventoryAtDrugStore } from '@configs/models/product.model';
import { PromotionPercent } from '@configs/models/promotion.model';
import PriceUnit from '@modules/products/PriceUnit';
import ProductBonusSection from '@modules/products/ProductBonusSection';
import ProductMetaData from '@modules/products/ProductMetaData';
import PromotionList from '@modules/products/PromotionList';
import { Typography, Tag } from 'antd';
import React from 'react';
import ProductDrugStoresSection from './ProductDrugStoresSection';
import DrugStore from '@configs/models/drug-store.model';
import ProductCTA from '@modules/products/ProductCTA';

const getMaxDiscount = (promotionPercents: PromotionPercent[]): number => {
  let maxDiscount = 0;
  promotionPercents.forEach((promotion) => {
    if (promotion.val > maxDiscount) {
      maxDiscount = promotion.val;
    }
  });
  return maxDiscount;
};

function ProductMain({
  product,
  offers,
  drugStoresAvailable,
  drugStores,
}: {
  product: Product;
  offers: OfferModel[];
  drugStoresAvailable?: InventoryAtDrugStore[];
  drugStores?: DrugStore[];
}) {
  const maxDisCount = getMaxDiscount(product?.promotions || []);

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Typography.Title className="mx-0 mt-2 text-2xl font-medium">
          {maxDisCount > 0 && (
            <Tag
              color={COLORS.red}
              className="m-0 mt-[-2px] rounded-full align-middle"
            >
              Giảm {maxDisCount * 100}%
            </Tag>
          )}{' '}
          {product?.detail?.displayName || product?.name}
        </Typography.Title>

        <ProductBonusSection offers={offers} />

        <PriceUnit
          price={product.retailPrice}
          discountVal={maxDisCount}
          unit={product.unit}
        />

        {!!product.promotions?.length && (
          <PromotionList
            promotionPercents={product.promotions || []}
            retailPrice={product.retailPrice}
          />
        )}

        <ProductCTA
          product={product}
          price={
            <PriceUnit
              price={product.retailPrice}
              discountVal={maxDisCount}
              unit={product.unit}
              size="small"
            />
          }
        />
      </div>

      <ProductDrugStoresSection
        drugStores={drugStores || []}
        drugStoresAvailable={drugStoresAvailable || []}
      />

      {product && <ProductMetaData product={product} />}
    </div>
  );
}

export default ProductMain;
