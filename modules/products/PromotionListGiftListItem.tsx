import { GiftOutlined } from '@ant-design/icons';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { GiftPromotionModel } from '@configs/models/promotion.model';
import { getProductName } from '@libs/helpers';
import CurrencyUtils from '@libs/utils/currency.utils';
import useProductAutoLoadByIds from '@libs/utils/hooks/useProductAutoLoadByIds';
import { Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import { Plus } from 'react-feather';
import AddToCartButton from './AddToCartButton';

function PromotionListGiftListItem({
  giftPromotion,
  retailPrice,
}: {
  giftPromotion: GiftPromotionModel;
  retailPrice: number;
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

  const totalPolicyPrice = (giftPromotion.policies || []).reduce(
    (acc, policy) => {
      return acc + (policy.prodInfo?.retailPrice || 0) * policy.requiredProdQty;
    },
    0
  );

  const _totalPrice = totalPolicyPrice + (retailPrice || 0);

  return (
    <div
      key={giftPromotion.key}
      className="my-2 flex flex-row items-start gap-2 py-4 px-4 "
    >
      <div className="flex h-[32px] w-[32px] border-collapse items-center justify-center rounded-lg bg-primary-background">
        <GiftOutlined size={20} className="text-primary" />
      </div>
      <div className="flex flex-1 items-center">
        <div className="flex flex-1 flex-col gap-2">
          <Typography.Paragraph className="m-0 text-xs">
            Mua kèm với sản phẩm
          </Typography.Paragraph>
          <ul className="m-0 block rounded-lg border border-solid border-blue-200 bg-blue-50 py-2 px-2 ">
            {giftPromotion.policies?.map((policy) => {
              const product = products.find((p) => p.key === policy.prodId);
              return (
                <li
                  key={policy.prodId}
                  className="my-1 flex items-center gap-2 text-xs text-black"
                >
                  <span>•</span>
                  <ImageWithFallback
                    style={{ minWidth: 24, minHeight: 24 }}
                    src={product?.detail?.image || ''}
                    width={24}
                    height={24}
                    className="inline-block flex-shrink-0 align-middle"
                  />

                  <Link
                    href={`/${product?.productType?.seoUrl}/${product?.detail?.seoUrl}`}
                    key={policy.prodId}
                    passHref
                  >
                    <a className="flex-1 hover:text-primary">
                      {policy.requiredProdQty} x{' '}
                      <b className="font-medium" style={{ cursor: 'pointer' }}>
                        {getProductName(product)}
                      </b>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Typography.Paragraph className="m-0 mt-2 text-xs">
            Sẽ được nhận quà tặng
          </Typography.Paragraph>
          <ul className="m-0 block rounded-lg border border-solid border-blue-200 bg-blue-50 py-2 px-2 ">
            {giftPromotion.gifts?.map((gift) => {
              const product = products.find((p) => p.key === gift.prodId);
              return (
                <li
                  key={gift.prodId}
                  className="my-1 flex items-center gap-2 text-xs text-black"
                >
                  <span>•</span>
                  <ImageWithFallback
                    style={{ minWidth: 24, minHeight: 24 }}
                    src={product?.detail?.image || ''}
                    width={24}
                    height={24}
                    className="inline-block flex-shrink-0 align-middle"
                  />

                  <Link
                    href={`/${product?.productType?.seoUrl}/${product?.detail?.seoUrl}`}
                    key={gift.prodId}
                    passHref
                  >
                    <a className="flex-1 hover:text-primary">
                      {gift.prodQty} x{' '}
                      <b className="font-medium" style={{ cursor: 'pointer' }}>
                        {getProductName(product)}
                      </b>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="m-0 text-xs ">
            Giá trị gói:{' '}
            <span className="text-base font-bold text-primary">
              {CurrencyUtils.format(_totalPrice)}
            </span>
          </p>

          <div className="ml-0 mt-1 w-[fit-content] max-w-[124px] lg:ml-0">
            <AddToCartButton
              className="h-[32px] w-[128px] rounded-lg text-left"
              label={
                <div className="flex items-center">
                  <Plus size={16} className="mr-1" />
                  <p className="m-0 text-xs font-semibold">Thêm vào giỏ</p>
                </div>
              }
              giftPromotion={giftPromotionWithPolicyProducts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionListGiftListItem;
