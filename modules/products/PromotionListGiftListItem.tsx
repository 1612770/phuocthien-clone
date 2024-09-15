import { GiftOutlined } from '@ant-design/icons';
import { GiftPromotionModel } from '@configs/models/promotion.model';
import useProductAutoLoadByIds from '@libs/utils/hooks/useProductAutoLoadByIds';
import { Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import AddToCartButton from './AddToCartButton';

function PromotionListGiftListItem({
  giftPromotion,
}: {
  giftPromotion: GiftPromotionModel;
}) {
  const productIds = [
    ...(giftPromotion.policies?.map((p) => p.prodId) || []),
    ...(giftPromotion.gifts?.map((p) => p.prodId) || []),
  ];
  const { products } = useProductAutoLoadByIds(productIds);

  const giftPromotionWithPolicyProducts: GiftPromotionModel = {
    ...giftPromotion,
    policies: giftPromotion.policies?.map((policy) => {
      const product = products.find((p) => p.key === policy.prodId);
      return {
        ...policy,
        product,
      };
    }),
  };

  return (
    <div
      key={giftPromotion.key}
      className="my-2 flex flex-col items-start gap-2 px-4 lg:flex-row lg:items-center"
    >
      <div className="flex flex-1 items-center">
        <div className="flex h-[32px] w-[32px] border-collapse items-center justify-center rounded-lg bg-primary-background">
          <GiftOutlined size={20} className="text-primary" />
        </div>
        <div className="flex-1">
          <Typography.Paragraph className="m-0">Mua kèm</Typography.Paragraph>
          <ul className="m-0 py-0">
            {giftPromotion.policies?.map((policy) => {
              const product = products.find((p) => p.key === policy.prodId);
              return (
                <li key={policy.prodId} className="text-xs text-black">
                  {policy.requiredProdQty} x{' '}
                  <Link
                    href={`/${product?.productType?.seoUrl}/${product?.detail?.seoUrl}`}
                    key={policy.prodId}
                    passHref
                  >
                    <a className="hover:text-primary">
                      <b style={{ cursor: 'pointer' }}>{product?.name}</b>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Typography.Paragraph className="text m-0 mt-2">
            Sẽ được nhận quà tặng
          </Typography.Paragraph>

          <ul>
            {giftPromotion.gifts?.map((gift) => {
              const product = products.find((p) => p.key === gift.prodId);
              return (
                <li key={gift.prodId} className="text-xs text-black">
                  {gift.prodQty} x{' '}
                  <Link
                    href={`/${product?.productType?.seoUrl}/${product?.detail?.seoUrl}`}
                    key={gift.prodId}
                    passHref
                  >
                    <a className="hover:text-primary">
                      <b style={{ cursor: 'pointer' }}>{product?.name}</b>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="ml-[32px] w-[fit-content] max-w-[124px] lg:ml-0">
        <AddToCartButton
          label="Thêm vào giỏ"
          giftPromotion={giftPromotionWithPolicyProducts}
        />
      </div>
    </div>
  );
}

export default PromotionListGiftListItem;
