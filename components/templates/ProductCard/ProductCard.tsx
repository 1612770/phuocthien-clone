import Product from '@configs/models/product.model';
import { Button, Card, Space, Tag, Typography } from 'antd';
import React from 'react';
import ImageWithFallback from '../ImageWithFallback';
import COLORS from '@configs/colors';
import AddToCartButton from '@modules/products/AddToCartButton';
import CurrencyUtils from '@libs/utils/currency.utils';
import { PromotionPercent } from '@configs/models/promotion.model';
import { GiftFilled } from '@ant-design/icons';
import LinkWrapper from '../LinkWrapper';

type ProductCardProps = {
  product: Product;
  className?: string;
  size?: 'small' | 'default';
  variant?: 'card' | 'list';
  promotionPercent?: PromotionPercent;
  showMinQuantity?: boolean;
  isProductTypeGroup?: boolean;
  actionComponent?: React.ReactNode;
  hrefDisabled?: boolean;
  hidePrice?: boolean;
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
  isProductTypeGroup,
  actionComponent,
  hrefDisabled,
  hidePrice,
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
  const href = hrefDisabled
    ? undefined
    : `/${product.productType?.seoUrl}/${product.detail?.seoUrl}`;
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
    <LinkWrapper href={href}>
      <div className={`group block w-full ${className} p-1`}>
        {variant === 'card' && (
          <Card
            hoverable={!hrefDisabled}
            bordered={false}
            cover={
              <div
                className={`relative  ${
                  size !== 'small' ? 'h-[160px]' : 'h-[140px]'
                } w-full bg-white `}
              >
                <ImageWithFallback
                  placeholder="blur"
                  className=""
                  alt={displayName || ''}
                  src={image || ''}
                  layout="fill"
                  objectFit="contain"
                  loading="lazy"
                />
                {!isProductTypeGroup && product.productTypeGroup?.name && (
                  <div>
                    <div
                      className="absolute -bottom-8 right-0 z-50 rounded-l-full  border border-r-0 border-solid border-y-primary border-l-primary bg-white px-3 py-1 text-xs text-primary"
                      style={{ width: 'calc(100% - 16px)' }}
                    >
                      <Typography.Text
                        ellipsis
                        className="whitespace-nowrap  text-primary"
                      >
                        {product.productTypeGroup?.name}
                      </Typography.Text>
                    </div>
                  </div>
                )}
              </div>
            }
            bodyStyle={{
              padding: '12px',
            }}
            className={`relative overflow-hidden `}
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
                <div className={`h-[${hidePrice ? 100 : 110}px] flex-1`}>
                  <Typography.Text
                    title={displayName}
                    className={`two-line-text md:three-line-text mt-7 ${
                      size !== 'small' ? 'h-[68px]' : 'h-[88px]'
                    }`}
                  >
                    {displayName}
                  </Typography.Text>
                  {(product.isPrescripted || product.detail?.isFoceNotSell) && (
                    <div className="text-xs font-bold text-primary md:mt-3">
                      <i>Sản phẩm cần tư vấn của dược sĩ</i>
                    </div>
                  )}
                  {!hidePrice &&
                    !product.isPrescripted &&
                    !product.detail?.isFoceNotSell && (
                      <div>
                        <Typography.Text className="mt-1 block">
                          <Typography.Text className="text-sm font-semibold text-primary-dark md:text-base">
                            {promotionPercent?.showPromoOnPrice
                              ? priceWithDiscount
                              : price}
                          </Typography.Text>
                          {product?.unit && (
                            <Typography.Text className="text-sm md:text-base">
                              &nbsp;/&nbsp;{product?.unit}
                            </Typography.Text>
                          )}
                        </Typography.Text>
                        {promotionPercent?.showPromoOnPrice && (
                          <Typography.Text className="text-gray text-sm line-through md:text-base">
                            {price}
                          </Typography.Text>
                        )}
                      </div>
                    )}
                </div>
                {size !== 'small' && (
                  <div className="mt-2">
                    {product.isPrescripted || product.detail?.isFoceNotSell ? (
                      <div className="w-full text-center">
                        <Button className="w-full">Liên hệ dược sĩ</Button>
                      </div>
                    ) : (
                      <AddToCartButton
                        className="w-full border border-solid border-gray-200 bg-white text-black shadow-none transition duration-300 group-hover:border-primary-light group-hover:bg-primary-light group-hover:text-white"
                        product={product}
                        promotionPercent={promotionPercent}
                      />
                    )}
                  </div>
                )}
                {actionComponent}
              </Space>
            </div>
          </Card>
        )}

        {variant === 'list' && (
          <div className="flex">
            <div
              className={`relative z-[120] ${
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
              />
              {isDiscount && (
                <Tag
                  color={COLORS.red}
                  className="absolute top-0 left-0 rounded-tr-none rounded-bl-none rounded-br-none"
                ></Tag>
              )}
            </div>
            <div className="ml-4 flex flex-1 flex-col gap-2 md:flex-row">
              <div className="relative flex flex-1 flex-col">
                <Space direction="vertical" size={0}>
                  <Typography.Text className={`mt-1 block`} title={displayName}>
                    {displayName}
                  </Typography.Text>
                  {(product?.isPrescripted ||
                    product.detail?.isFoceNotSell) && (
                    <div className="text-xs font-bold text-primary md:mt-3">
                      <i>Sản phẩm cần tư vấn của dược sĩ</i>
                    </div>
                  )}
                  <Tag className="mt-1 border-none bg-primary-background">
                    {product?.productGroup?.name}
                  </Tag>

                  {!hidePrice &&
                    !product?.isPrescripted &&
                    !product.detail?.isFoceNotSell && (
                      <div>
                        <Typography.Text className="mt-1 block">
                          <Typography.Text className="text-base font-semibold text-primary-dark">
                            {priceWithDiscount !== price
                              ? priceWithDiscount
                              : price}
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
                    )}
                </Space>
              </div>
              {actionComponent && <div>{actionComponent}</div>}
            </div>
          </div>
        )}
      </div>
    </LinkWrapper>
  );
}

export default ProductCard;
