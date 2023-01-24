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
  const href = `/${UrlUtils.generateSlug(
    product.productType?.name,
    product.productType?.key
  )}/${UrlUtils.generateSlug(
    product.productGroup?.name,
    product.productGroup?.key
  )}/${UrlUtils.generateSlug(product?.name, product?.key)}`;

  return (
    <Link href={href}>
      <a className="group inline-block w-full">
        {variant === 'card' && (
          <Card
            cover={
              <div
                className={`relative ${
                  size !== 'small' ? 'h-[240px]' : 'h-[160px]'
                } w-full bg-gray-100 transition-transform duration-300 group-hover:scale-110`}
              >
                <ImageWithFallback
                  alt={product?.name || ''}
                  src={product?.detail?.image || ''}
                  layout="fill"
                  objectFit="cover"
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
              <Tag
                color={COLORS.red}
                className="absolute top-0 left-0 rounded-tr-none rounded-bl-none rounded-br-none"
              >
                Giảm giá
              </Tag>
            )}

            <div className="relative flex flex-col">
              <Space direction="vertical" size={0}>
                {product?.unit && (
                  <Tag color="blue" className="capitalize">
                    {product?.unit}
                  </Tag>
                )}
                <Typography.Text
                  className={`mt-1 block ${
                    size !== 'small' ? 'min-h-[48px]' : 'min-h-[68px]'
                  }`}
                >
                  {product?.name}
                </Typography.Text>
                <Typography.Text className="mt-1 block">
                  <Typography.Text className="text-base font-semibold">
                    {product?.retailPrice?.toLocaleString('it-IT', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                    <sup className="text-sups font-semibold">đ</sup>
                  </Typography.Text>
                  {product?.unit && (
                    <Typography.Text className="text-base">
                      /{product?.unit}
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
                alt={product?.name || ''}
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
                  <Typography.Text className={`mt-1 block`}>
                    {product?.name}
                  </Typography.Text>
                  <Tag className="mt-1 border-none bg-primary-background">
                    {product?.productGroup?.name} - {product?.productType?.name}
                  </Tag>
                  <Typography.Text className="mt-1 block">
                    <Typography.Text className="text-base font-semibold text-primary">
                      {product?.retailPrice?.toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                      <sup className="text-sups font-semibold">đ</sup>
                    </Typography.Text>
                    {product?.unit && (
                      <Typography.Text className="text-base">
                        /{product?.unit}
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
