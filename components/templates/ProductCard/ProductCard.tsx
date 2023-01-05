import Product from '@configs/models/product.model';
import { Button, Card, Space, Tag, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import ImageWithFallback from '../ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';
import COLORS from '@configs/colors';
import { useCart } from '@providers/CartProvider';

type ProductCardProps = {
  product: Product;
  className?: string;
  href: string;
  size?: 'small' | 'default';
};

function ProductCard({
  product,
  className,
  href,
  size = 'default',
}: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Link href={href}>
      <a className="group inline-block w-full">
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
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart({ product, quantity: 1 });
                  }}
                  key="add-to-cart"
                  block
                  className="mt-2 border border-solid border-gray-200 bg-white text-black shadow-none transition duration-300 group-hover:border-primary-light group-hover:bg-primary-light group-hover:text-white"
                  type="primary"
                >
                  Thêm vào giỏ hàng
                </Button>
              )}
            </Space>
          </div>
        </Card>
      </a>
    </Link>
  );
}

export default ProductCard;
