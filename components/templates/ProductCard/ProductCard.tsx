import Product from '@configs/models/product.model';
import ImageUtils from '@libs/utils/image.utils';
import { Button, Card, Space, Tag, Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type ProductCardProps = {
  product: Product;
  className?: string;
  href: string;
};

function ProductCard({ product, className, href }: ProductCardProps) {
  const [imageSource, setImageSource] = useState('');

  useEffect(() => {
    setImageSource(ImageUtils.getFullImageUrl(product?.detail?.image));
  }, [product]);

  return (
    <Link href={href}>
      <a>
        <Card
          cover={
            <div className="relative h-[240px] w-full bg-gray-100">
              <Image
                alt={product?.name || ''}
                src={imageSource}
                layout="fill"
                objectFit="cover"
                onError={() => {
                  setImageSource(ImageUtils.getRandomMockProductImageUrl());
                }}
              />
            </div>
          }
          bodyStyle={{
            padding: '12px',
          }}
          className={`${className} relative overflow-hidden`}
        >
          {/* <Tag
        color={COLORS.red}
        className="absolute top-0 left-0 rounded-tr-none rounded-bl-none rounded-br-none"
      >
        -30%
      </Tag> */}

          <div className="relative flex flex-col">
            <Space direction="vertical" size={0}>
              <Tag color="blue" className="capitalize">
                {product?.unit}
              </Tag>
              <Typography.Text className="mt-1 block min-h-[48px]">
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
                <Typography.Text className="text-base">
                  /{product?.unit}
                </Typography.Text>
              </Typography.Text>

              <Button
                key="add-to-cart"
                block
                className="mt-2 bg-primary-light shadow-none"
                type="primary"
              >
                Thêm vào giỏ hàng
              </Button>
            </Space>
          </div>
        </Card>
      </a>
    </Link>
  );
}

export default ProductCard;
