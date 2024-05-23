import COLORS from '@configs/colors';
import OfferModel from '@configs/models/offer.model';
import Product, { InventoryAtDrugStore } from '@configs/models/product.model';
import { PromotionPercent } from '@configs/models/promotion.model';
import PriceUnit from '@modules/products/PriceUnit';
import ProductBonusSection from '@modules/products/ProductBonusSection';
import PromotionList from '@modules/products/PromotionList';
import { Typography, Tag, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import ProductDrugStoresSection from './ProductDrugStoresSection';
import ProductCTA from '@modules/products/ProductCTA';
import { useAppData } from '@providers/AppDataProvider';
import FocusContentSection from '@modules/homepage/FocusContentSection';
import { GiftPromotion, DealPromotion } from '@libs/client/Promotion';
import { ProductClient } from '@libs/client/Product';

const getMaxDiscount = (promotionPercents: PromotionPercent[]): number => {
  let maxDiscount = 0;
  promotionPercents.forEach((promotion) => {
    if (promotion.val > maxDiscount) {
      maxDiscount = promotion.val;
    }
  });
  return maxDiscount;
};
const getMaxPercentObj = (
  promotionPercents: PromotionPercent[]
): PromotionPercent | null => {
  let maxDiscount = 0;
  let obj: PromotionPercent | null = null;
  promotionPercents.forEach((promotion) => {
    if (promotion.val > maxDiscount) {
      maxDiscount = promotion.val;
      obj = promotion;
    }
  });
  return obj;
};
function ProductMain({
  product,
  offers,
  giftPromotions,
  dealPromotions,
}: {
  product: Product;
  offers: OfferModel[];
  giftPromotions: GiftPromotion[];
  dealPromotions: DealPromotion[];
  errorsInventory?: {
    code?: string;
    message?: string;
  };
}) {
  const maxDisCount = getMaxDiscount(product?.promotions || []);
  const objPercent = getMaxPercentObj(product?.promotions || []);
  const { focusContent } = useAppData();
  const [drugStoresAvailable, setDrugStoresAvailable] = useState<
    InventoryAtDrugStore[] | undefined
  >(undefined);
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const client = new ProductClient(null, {});
        const res = await client.checkInventoryAtDrugStores({
          key: product.key || '',
        });
        if (res.status === 'OK' && res.data && res.data.length > 0) {
          setDrugStoresAvailable(res.data);
        } else {
          setDrugStoresAvailable([]);
        }
      } catch (error) {
        setDrugStoresAvailable([]);
      }
    };
    if (product.key) {
      loadInventory();
    }
  }, [product.key]);
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
        {product?.isPrescripted && (
          <div className="text-primary">
            <div className="text-amber-600">
              Lưu ý: Sản phẩm chỉ bán khi có chỉ định của bác sĩ, mọi thông tin
              ở website chỉ có tính chất tham khảo.
            </div>
            <b>
              <i>Sản phẩm cần tư vấn từ dược sĩ.</i>
            </b>
          </div>
        )}
        <ProductBonusSection offers={offers} />
        <div className="mb-4 flex items-center justify-around rounded-3xl border-2 border-solid border-gray-100 p-2 shadow-md">
          {product.isPrescripted ? (
            <div className="grid w-full grid-flow-row grid-cols-2 gap-x-2">
              <div className="w-full">
                <Button
                  size="large"
                  type="primary"
                  shape="round"
                  className="w-full"
                  onClick={() =>
                    window.open('https://zalo.me/phuocthienpharmacy', '_blank')
                  }
                >
                  Tư vấn ngay
                </Button>
              </div>
              <div className="w-full">
                <Button size="large" shape="round" className="w-full" disabled>
                  Gửi toa cho nhà thuốc
                </Button>
              </div>
            </div>
          ) : (
            <>
              <PriceUnit
                price={product.retailPrice}
                discountVal={objPercent?.showPromoOnPrice ? maxDisCount : 0}
                unit={product.unit}
              />
              <ProductCTA
                product={product}
                isAvailable={
                  drugStoresAvailable &&
                  drugStoresAvailable?.length > 0 &&
                  drugStoresAvailable.filter((el) => el.quantity > 0).length > 0
                }
                price={
                  <PriceUnit
                    price={product.retailPrice}
                    discountVal={maxDisCount}
                    unit={product.unit}
                    size="small"
                  />
                }
              />
            </>
          )}
        </div>
        <PromotionList
          promotionPercents={product.promotions || []}
          retailPrice={product.retailPrice}
          giftPromotions={giftPromotions}
          dealPromotions={dealPromotions}
        />
      </div>
      <ProductDrugStoresSection drugStoresAvailable={drugStoresAvailable} />

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
