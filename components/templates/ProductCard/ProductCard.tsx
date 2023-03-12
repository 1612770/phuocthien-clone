import Product from '@configs/models/product.model';
import { Card, Space, Tag, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import ImageWithFallback from '../ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';
import COLORS from '@configs/colors';
import AddToCartButton from '@modules/products/AddToCartButton';
import UrlUtils from '@libs/utils/url.utils';

type ProductCardProps = {
  product: Product;
  className?: string;
  size?: 'small' | 'default';
  variant?: 'card' | 'list';
};

function ProductCard({
  product,
  className,
  size = 'default',
  variant = 'card',
}: ProductCardProps) {
  const productTypeKey = product?.productType?.key || product?.productTypeKey;
  const productGroupKey =
    product?.productGroup?.key || product?.productGroupKey;

  const href = `/san-pham/${UrlUtils.generateSlug(
    product.productType?.name,
    productTypeKey
  )}/${UrlUtils.generateSlug(
    product.productGroup?.name,
    productGroupKey
  )}/${UrlUtils.generateSlug(product?.detail?.displayName, product?.key)}`;

  return (
    <Link href={href}>
      <a className="group inline-block w-full">
        {variant === 'card' && (
          <Card
            cover={
              <div
                className={`relative ${
                  size !== 'small' ? 'h-[160px]' : 'h-[140px]'
                } w-full bg-white transition-transform duration-300 group-hover:scale-110`}
              >
                <ImageWithFallback
                  alt={product?.detail?.displayName || ''}
                  src={product?.detail?.image || ''}
                  layout="fill"
                  objectFit="contain"
                  loading="lazy"
                  getMockImage={() => ImageUtils.getRandomMockProductImageUrl()}
                />
              </div>
            }
            bodyStyle={{
              padding: '12px',
            }}
            className={`${className} relative overflow-hidden transition duration-300 group-hover:border-primary-light`}
          >
            {product.detail?.isSaleOff && (
              <Tag color={COLORS.red} className="absolute top-[8px] left-[8px]">
                Giảm giá
              </Tag>
            )}

            {product?.unit && (
              <Tag
                color="blue"
                className="absolute top-[8px] right-[8px] mr-0 capitalize"
              >
                {product?.unit}
              </Tag>
            )}

            <div className="relative flex flex-col">
              <Space direction="vertical" size={0}>
                <Typography.Text
                  title={product?.detail?.displayName}
                  className={`two-line-text mt-1 ${
                    size !== 'small' ? 'h-[48px]' : 'h-[68px]'
                  }`}
                >
                  {product?.detail?.displayName}
                </Typography.Text>
                <Typography.Text className="mt-1 block">
                  <Typography.Text className="text-base font-semibold text-primary-dark">
                    {product?.retailPrice?.toLocaleString('it-IT', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </Typography.Text>
                  {product?.unit && (
                    <Typography.Text className="text-base">
                      &nbsp;/&nbsp;{product?.unit}
                    </Typography.Text>
                  )}
                </Typography.Text>

                {size !== 'small' && (
                  <div className="mt-2">
                    <AddToCartButton
                      className="w-full border border-solid border-gray-200 bg-white text-black shadow-none transition duration-300 group-hover:border-primary-light group-hover:bg-primary-light group-hover:text-white"
                      product={product}
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
                alt={product?.detail?.displayName || ''}
                src={product?.detail?.image || ''}
                layout="fill"
                objectFit="cover"
                loading="lazy"
                getMockImage={() => ImageUtils.getRandomMockProductImageUrl()}
              />
              {product.detail?.isSaleOff && (
                <Tag
                  color={COLORS.red}
                  className="absolute top-0 left-0 rounded-tr-none rounded-bl-none rounded-br-none"
                >
                  Giảm giá
                </Tag>
              )}
            </div>
            <div className="ml-4">
              <div className="relative flex flex-col">
                <Space direction="vertical" size={0}>
                  <Typography.Text
                    className={`mt-1 block`}
                    title={product?.detail?.displayName}
                  >
                    {product?.detail?.displayName}
                  </Typography.Text>
                  <Tag className="mt-1 border-none bg-primary-background">
                    {product?.productGroup?.name}
                  </Tag>
                  <Typography.Text className="mt-1 block">
                    <Typography.Text className="text-base font-semibold text-primary-dark">
                      {product?.retailPrice?.toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Typography.Text>
                    {product?.unit && (
                      <Typography.Text className="text-base">
                        &nbsp;/&nbsp;{product?.unit}
                      </Typography.Text>
                    )}
                  </Typography.Text>
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
