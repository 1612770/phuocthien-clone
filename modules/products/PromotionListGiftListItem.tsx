import { GiftOutlined } from '@ant-design/icons';
import { GiftPromotion } from '@libs/client/Promotion';
import useProductAutoLoadByIds from '@libs/utils/hooks/useProductAutoLoadByIds';
import { Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import AddToCartButton from './AddToCartButton';

function PromotionListGiftListItem({
  giftPromotion,
}: {
  giftPromotion: GiftPromotion;
}) {
  const productIds = [
    ...(giftPromotion.policy?.map((p) => p.productId) || []),
    ...(giftPromotion.gift?.map((p) => p.productId) || []),
  ];
  const { products } = useProductAutoLoadByIds(productIds);

  const giftPromotionWithPolicyProducts: GiftPromotion = {
    ...giftPromotion,
    policy: giftPromotion.policy?.map((policy) => {
      const product = products.find((p) => p.key === policy.productId);
      return {
        ...policy,
        product,
      };
    }),
  };

  return (
    <div
      key={giftPromotion.promotionGiftId}
      className="my-2 flex flex-col items-start gap-2 px-4 lg:flex-row lg:items-center"
    >
      <div className="flex items-center">
        <div className="flex h-[32px] w-[32px] border-collapse items-center justify-center rounded-lg bg-primary-background">
          <GiftOutlined size={20} className="text-primary" />
        </div>
        <div className="flex-1">
          <Typography.Paragraph className="m-0">Mua kèm</Typography.Paragraph>
          <ul className="m-0 py-0">
            {giftPromotion.policy?.map((policy) => {
              const product = products.find((p) => p.key === policy.productId);
              return (
                <li key={policy.productId} className="text-xs text-black">
                  {policy.requiredQuantity} x{' '}
                  <Link
                    href={`/${product?.productType?.seoUrl}/${product?.detail?.seoUrl}`}
                    key={policy.productId}
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
            {giftPromotion.gift?.map((gift) => {
              const product = products.find((p) => p.key === gift.productId);
              return (
                <li key={gift.productId} className="text-xs text-black">
                  {gift.quantity} x{' '}
                  <Link
                    href={`/${product?.productType?.seoUrl}/${product?.detail?.seoUrl}`}
                    key={gift.productId}
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
