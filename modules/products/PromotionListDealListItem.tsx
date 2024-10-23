import { StarOutlined } from '@ant-design/icons';
import CurrencyUtils from '@libs/utils/currency.utils';
import useProductAutoLoadByIds from '@libs/utils/hooks/useProductAutoLoadByIds';
import { Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import AddToCartButton from './AddToCartButton';
import { getProductName } from '@libs/helpers';
import { DealPromotionModel } from '@configs/models/promotion.model';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { Plus } from 'react-feather';

function PromotionListDealListItem({
  dealPromotion,
}: {
  dealPromotion: DealPromotionModel;
}) {
  const productIds = [...(dealPromotion.policies?.map((p) => p.prodId) || [])];
  const { products } = useProductAutoLoadByIds(productIds);

  return (
    <div
      key={dealPromotion.key}
      className="my-2 flex flex-col items-start gap-2 px-4 pt-4 lg:flex-row lg:items-center"
    >
      <div className="flex items-center">
        <div className="flex h-[32px] w-[32px] border-collapse items-center justify-center rounded-lg bg-primary-background">
          <StarOutlined size={20} className="text-primary" />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <Typography.Paragraph className="m-0 mt-2 text-xs">
            Mua cùng nhau được giảm
          </Typography.Paragraph>
          <ul className="m-0 block rounded-lg border border-solid border-blue-200 bg-blue-50 py-2 px-2 ">
            {dealPromotion.policies?.map((policy) => {
              const product = products.find((p) => p.key === policy.prodId);
              return (
                <li
                  key={policy.prodId}
                  className="my-1 flex items-center gap-2 text-xs text-black"
                >
                  <span>•</span>
                  <ImageWithFallback
                    src={product?.detail?.image || ''}
                    width={24}
                    height={24}
                    className=" inline-block align-middle"
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
          <div className="flex items-center">
            {dealPromotion.totalAmount != dealPromotion.totalCost && (
              <Typography.Paragraph className="text m-0 line-through">
                {CurrencyUtils.format(dealPromotion.totalCost)}
              </Typography.Paragraph>
            )}
            &nbsp;
            <Typography.Paragraph className="text text-bold m-0 text-primary">
              <span className="text-xs text-gray-900">Chỉ còn </span>
              <b>{CurrencyUtils.format(dealPromotion.totalAmount)}</b>
            </Typography.Paragraph>
          </div>

          <div className="ml-0 w-[fit-content] max-w-[124px] lg:ml-0">
            <AddToCartButton
              dealPromotion={dealPromotion}
              className="h-[32px] w-[128px] rounded-lg text-left"
              label={
                <div className="flex items-center">
                  <Plus size={16} className="mr-1" />
                  <p className="m-0 text-xs font-semibold">Thêm vào giỏ</p>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionListDealListItem;
