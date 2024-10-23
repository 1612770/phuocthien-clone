import OfferModel from '@configs/models/offer.model';
import Product, { InventoryAtDrugStore } from '@configs/models/product.model';
import PriceUnit from '@modules/products/PriceUnit';
import ProductBonusSection from '@modules/products/ProductBonusSection';
import PromotionList from '@modules/products/PromotionList';
import { Typography, Button, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import ProductDrugStoresSection from './ProductDrugStoresSection';
import ProductCTA from '@modules/products/ProductCTA';
import { useAppData } from '@providers/AppDataProvider';
import FocusContentSection from '@modules/homepage/FocusContentSection';
import { ProductClient } from '@libs/client/Product';
import { useCart } from '@providers/CartProvider';
import { PromotionPercent } from '@configs/models/promotion.model';
import { InfoCircleOutlined } from '@ant-design/icons';
import COLORS from '@configs/colors';
import { getProductName } from '@libs/helpers';

export const getMaxPromotion = (
  promotionPercents: PromotionPercent[]
): PromotionPercent | undefined => {
  return promotionPercents.reduce((prev, curr) => {
    if (curr.val > (prev?.val || 0)) {
      return curr;
    }

    return prev;
  }, undefined as PromotionPercent | undefined);
};

const getMaxPromotionInstruction = (
  promotionPercents: PromotionPercent[],
  currentQuantity?: number
): string => {
  const maxPromotion = getMaxPromotion(promotionPercents);

  if (!maxPromotion) return '';

  if (maxPromotion.productQuantityMinCondition <= (currentQuantity || 0))
    return '';

  return `Mua ${currentQuantity ? 'thêm' : 'ít nhất'} ${
    maxPromotion.productQuantityMinCondition - (currentQuantity || 0)
  } sản phẩm để được giảm ${maxPromotion.val * 100}%`;
};

function ProductMain({
  product,
  offers,
}: {
  product: Product;
  offers: OfferModel[];
  errorsInventory?: {
    code?: string;
    message?: string;
  };
}) {
  const { focusContent } = useAppData();
  const { cartProducts } = useCart();

  const [drugStoresAvailable, setDrugStoresAvailable] = useState<
    InventoryAtDrugStore[] | undefined
  >(undefined);

  const curProductIncart = cartProducts.find(
    (item) => item.product?.key === product?.key
  );

  const maxPromotionInstruction = getMaxPromotionInstruction(
    product?.promotions || [],
    curProductIncart?.quantity
  );

  const maxPromotion = getMaxPromotion(product.promotions || []);

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
          {(maxPromotion?.val || 0) > 0 && (
            <Tag
              color={COLORS.red}
              className="m-0 mt-[-2px] rounded-full align-middle"
            >
              Giảm {(maxPromotion?.val || 0) * 100}%
            </Tag>
          )}{' '}
          {getProductName(product)}
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
        <div className="flex items-center justify-around rounded-3xl border-2 border-solid border-gray-100 p-2 shadow-md md:mb-4">
          {product.isPrescripted || product.detail?.isFoceNotSell ? (
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
            <div className="flex flex-col items-center gap-4 sm:flex-row md:gap-2">
              <PriceUnit price={product.retailPrice} unit={product.unit} />
              <div className="flex flex-col gap-1 py-2">
                <ProductCTA
                  product={product}
                  isAvailable={
                    drugStoresAvailable &&
                    drugStoresAvailable?.length > 0 &&
                    drugStoresAvailable.filter((el) => el.quantity > 0).length >
                      0
                  }
                  price={
                    <PriceUnit
                      price={product.retailPrice}
                      unit={product.unit}
                      size="small"
                    />
                  }
                />

                {maxPromotionInstruction && (
                  <div className="flex items-center gap-2 text-blue-500">
                    <InfoCircleOutlined size={12} />
                    <Typography.Text className="text-inherit">
                      {maxPromotionInstruction}
                    </Typography.Text>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <PromotionList
          promotionPercents={product.promotions || []}
          retailPrice={product.retailPrice}
          dealPromotions={product.promoDeals || []}
          giftPromotions={product.promoGifts || []}
        />
      </div>
      <ProductDrugStoresSection drugStoresAvailable={drugStoresAvailable} />

      <p className="md:py-2">
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
