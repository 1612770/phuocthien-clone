import Product from '@configs/models/product.model';
import { Card, Space, Tag, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import ImageWithFallback from '../ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';
import COLORS from '@configs/colors';
import AddToCartButton from '@modules/products/AddToCartButton';
import CurrencyUtils from '@libs/utils/currency.utils';
import { PromotionPercent } from '@configs/models/promotion.model';
import { GiftFilled } from '@ant-design/icons';

type ProductCardProps = {
  product: Product;
  className?: string;
  size?: 'small' | 'default';
  variant?: 'card' | 'list';
  promotionPercent?: PromotionPercent;
  showMinQuantity?: boolean;
};

const getMaxDiscount = (promotionPercents: PromotionPercent[]): number => {
  let maxDiscount = 0;
  promotionPercents.forEach((promotionPercent) => {
    if (promotionPercent.val > maxDiscount) {
      maxDiscount = promotionPercent.val;
    }
  });
  return maxDiscount;
};

function ProductCard({
  product,
  className,
  size = 'default',
  variant = 'card',
  promotionPercent,
  showMinQuantity = false,
}: ProductCardProps) {
  const productDiscountVal =
    promotionPercent?.val || getMaxDiscount(product?.promotions || []) || 0;

  const displayName = product?.detail?.displayName || product.name;
  const image = product?.detail?.image || product.images?.[0]?.url || '';
  const price = CurrencyUtils.format(product?.retailPrice);
  const priceWithDiscount = CurrencyUtils.formatWithDiscount(
    product?.retailPrice,
    productDiscountVal
  );

  const isDiscount = productDiscountVal > 0;

  const href = `/${product.productType?.seoUrl}/${product.detail?.seoUrl}`;

  const disCountText = showMinQuantity ? (
    <>
      <GiftFilled />
      &nbsp;Mua {promotionPercent?.productQuantityMinCondition || 1} giảm{' '}
      {productDiscountVal * 100}%
    </>
  ) : (
    `Giảm ${productDiscountVal * 100}%`
  );

  return (
    <Link href={href}>
      <a className={`group block w-full ${className}`}>
        {variant === 'card' && (
          <Card
            cover={
              <div
                className={`relative ${
                  size !== 'small' ? 'h-[160px]' : 'h-[140px]'
                } w-full bg-white transition-transform duration-300 group-hover:scale-110`}
              >
                <ImageWithFallback
                  placeholder="blur"
                  alt={displayName || ''}
                  src={image || ''}
                  layout="fill"
                  objectFit="contain"
                  loading="lazy"
                />
              </div>
            }
            bodyStyle={{
              padding: '12px',
            }}
            className={`relative overflow-hidden transition duration-300 group-hover:border-primary-light`}
          >
            {isDiscount && (
              <Tag
                color={COLORS.red}
                className="absolute top-[8px] left-[8px] rounded-full"
              >
                {disCountText}
              </Tag>
            )}

            {product?.unit && (
              <Tag
                color="blue"
                className="absolute top-[8px] right-[8px] mr-0 rounded-full capitalize"
              >
                {product?.unit}
              </Tag>
            )}

            <div className="relative flex flex-col">
              <Space direction="vertical" size={0}>
                <div className="h-[90px] flex-1">
                  <Typography.Text
                    title={displayName}
                    className={`two-line-text mt-1 ${
                      size !== 'small' ? 'h-[48px]' : 'h-[68px]'
                    }`}
                  >
                    {displayName}
                  </Typography.Text>
                  <Typography.Text className="mt-1 block">
                    <Typography.Text className="text-base font-semibold text-primary-dark">
                      {priceWithDiscount !== price ? priceWithDiscount : price}
                    </Typography.Text>
                    {product?.unit && (
                      <Typography.Text className="text-base">
                        &nbsp;/&nbsp;{product?.unit}
                      </Typography.Text>
                    )}
                  </Typography.Text>
                  {priceWithDiscount !== price && (
                    <Typography.Text className="text-gray line-through">
                      {price}
                    </Typography.Text>
                  )}
                </div>

                {size !== 'small' && (
                  <div className="mt-2">
                    <AddToCartButton
                      className="w-full border border-solid border-gray-200 bg-white text-black shadow-none transition duration-300 group-hover:border-primary-light group-hover:bg-primary-light group-hover:text-white"
                      product={product}
                      promotionPercent={promotionPercent}
                    />
                  </div>
                )}
              </Space>
            </div>
          </Card>
        )}

        {variant === 'list' && (
          <div className="flex">
            <div
              className={`relative ${
                size !== 'small'
                  ? 'h-[80px] min-w-[100px]'
                  : 'h-[40px] min-w-[60px]'
              } overflow-hidden rounded-lg border border-solid border-gray-200 bg-gray-100`}
            >
              <ImageWithFallback
                placeholder="blur"
                alt={displayName || ''}
                src={image || ''}
                layout="fill"
                objectFit="cover"
                loading="lazy"
                getMockImage={() => ImageUtils.getRandomMockProductImageUrl()}
              />
              {isDiscount && (
                <Tag
                  color={COLORS.red}
                  className="absolute top-0 left-0 rounded-tr-none rounded-bl-none rounded-br-none"
                ></Tag>
              )}
            </div>
            <div className="ml-4">
              <div className="relative flex flex-col">
                <Space direction="vertical" size={0}>
                  <Typography.Text className={`mt-1 block`} title={displayName}>
                    {displayName}
                  </Typography.Text>
                  <Tag className="mt-1 border-none bg-primary-background">
                    {product?.productGroup?.name}
                  </Tag>
                  <Typography.Text className="mt-1 block">
                    <Typography.Text className="text-base font-semibold text-primary-dark">
                      {priceWithDiscount !== price ? priceWithDiscount : price}
                    </Typography.Text>
                    {product?.unit && (
                      <Typography.Text className="text-base">
                        &nbsp;/&nbsp;{product?.unit}
                      </Typography.Text>
                    )}
                  </Typography.Text>
                  {priceWithDiscount !== price && (
                    <Typography.Text className="text-gray line-through">
                      {price}
                    </Typography.Text>
                  )}
                </Space>
              </div>
            </div>
          </div>
        )}
      </a>
    </Link>
  );
}

export default ProductCard;
