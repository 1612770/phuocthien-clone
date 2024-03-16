import { StarOutlined } from '@ant-design/icons';
import { DealPromotion } from '@libs/client/Promotion';
import CurrencyUtils from '@libs/utils/currency.utils';
import useProductAutoLoadByIds from '@libs/utils/hooks/useProductAutoLoadByIds';
import { Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import AddToCartButton from './AddToCartButton';
import { getProductName } from '@libs/helpers';

function PromotionListDealListItem({
  dealPromotion,
}: {
  dealPromotion: DealPromotion;
}) {
  const productIds = [...(dealPromotion.policy?.map((p) => p.productId) || [])];
  const { products } = useProductAutoLoadByIds(productIds);

  return (
    <div
      key={dealPromotion.promotionDealId}
      className="my-2 flex items-center gap-2 px-4"
    >
      <div className="flex h-[32px] w-[32px] border-collapse items-center justify-center rounded-lg bg-primary-background">
        <StarOutlined size={20} className="text-primary" />
      </div>

      <div className="flex-1">
        <Typography.Paragraph className="text m-0 mt-2">
          Mua kèm các sản phẩm sau để nhận ưu đãi
        </Typography.Paragraph>
        <ul>
          {dealPromotion.policy?.map((policy) => {
            const product = products.find((p) => p.key === policy.productId);
            return (
              <li key={policy.productId} className="text-xs text-black">
                {policy.requiredQty} x{' '}
                <Link
                  href={`/${product?.productType?.seoUrl}/${product?.detail?.seoUrl}`}
                  key={policy.productId}
                  passHref
                >
                  <a className="hover:text-primary">
                    <b style={{ cursor: 'pointer' }}>
                      {getProductName(product)}
                    </b>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center">
          {dealPromotion.totalAmount != dealPromotion.totalCost && (
            <Typography.Paragraph className="text m-0 line-through">
              {CurrencyUtils.format(dealPromotion.totalAmount)}
            </Typography.Paragraph>
          )}
          &nbsp;
          <Typography.Paragraph className="text text-bold m-0 text-primary">
            <b>{CurrencyUtils.format(dealPromotion.totalCost)}</b>
          </Typography.Paragraph>
        </div>
      </div>
      <div className="w-[fit-content] max-w-[124px]">
        <AddToCartButton dealPromotion={dealPromotion} label="Thêm vào giỏ" />
      </div>
    </div>
  );
}

export default PromotionListDealListItem;
