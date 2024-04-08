import COLORS from '@configs/colors';
import OfferModel from '@configs/models/offer.model';
import Product, { InventoryAtDrugStore } from '@configs/models/product.model';
import { PromotionPercent } from '@configs/models/promotion.model';
import PriceUnit from '@modules/products/PriceUnit';
import ProductBonusSection from '@modules/products/ProductBonusSection';
import PromotionList from '@modules/products/PromotionList';
import { Typography, Tag } from 'antd';
import React from 'react';
import ProductDrugStoresSection from './ProductDrugStoresSection';
import DrugStore from '@configs/models/drug-store.model';
import ProductCTA from '@modules/products/ProductCTA';
import { useAppData } from '@providers/AppDataProvider';
import FocusContentSection from '@modules/homepage/FocusContentSection';
import { GiftPromotion, DealPromotion } from '@libs/client/Promotion';

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
  giftPromotions,
  dealPromotions,
  errorsInventory,
}: {
  product: Product;
  offers: OfferModel[];
  drugStoresAvailable?: InventoryAtDrugStore[];
  drugStores?: DrugStore[];
  giftPromotions: GiftPromotion[];
  dealPromotions: DealPromotion[];
  errorsInventory?: {
    code?: string;
    message?: string;
  };
}) {
  const maxDisCount = getMaxDiscount(product?.promotions || []);
  const { focusContent } = useAppData();
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
        <div className="mb-4 flex items-center justify-around rounded-3xl border-2 border-solid border-gray-100 p-2 shadow-md">
          <PriceUnit
            price={product.retailPrice}
            discountVal={maxDisCount}
            unit={product.unit}
          />
          <ProductCTA
            product={product}
            isAvailable={drugStoresAvailable && drugStoresAvailable?.length > 0}
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
        <PromotionList
          promotionPercents={product.promotions || []}
          retailPrice={product.retailPrice}
          giftPromotions={giftPromotions}
          dealPromotions={dealPromotions}
        />
      </div>
      <ProductDrugStoresSection product={product} />

      <p className="py-2">
        Gọi nhận tư vấn với dược sĩ
        <a href="tel:1800599964" className="px-2 font-bold text-primary">
          1800 599 964
        </a>
        (7:00 - 22:00 - <b className="text-primary">Miễn phí</b>)
      </p>
      <FocusContentSection focusContent={focusContent || []} isProductPage />
    </div>
  );
}

export default ProductMain;
