import { TagOutlined } from '@ant-design/icons';
import { PromotionPercent } from '@configs/models/promotion.model';
import CurrencyUtils from '@libs/utils/currency.utils';
import TimeUtils from '@libs/utils/time.utils';
import { Typography } from 'antd';
import React from 'react';

function PromotionListPercentListItem({
  promotion,
  retailPrice,
}: {
  promotion: PromotionPercent;
  retailPrice?: number;
}) {
  return (
    <div
      key={promotion.promotionKey}
      className="my-2 flex items-center gap-2 px-4"
    >
      <div className="flex h-[32px] w-[32px] border-collapse items-center justify-center rounded-lg bg-primary-background">
        <TagOutlined size={20} className="text-primary" />
      </div>
      <div>
        <Typography.Paragraph className="m-0">
          Mua ít nhất {promotion.productQuantityMinCondition} sản phẩm để nhận
          khuyến mãi {promotion.val * 100}%
          {retailPrice ? (
            <>
              , chỉ còn{' '}
              <b className="text-primary">
                {CurrencyUtils.format(retailPrice * (1 - promotion.val))}{' '}
              </b>
            </>
          ) : (
            ''
          )}
        </Typography.Paragraph>
        <Typography.Paragraph className="m-0 text-xs text-gray-500">
          Khuyến mãi áp dụng đến{' '}
          {TimeUtils.formatDate(promotion.endDatePromo, {
            noTime: true,
          })}
        </Typography.Paragraph>
      </div>
    </div>
  );
}

export default PromotionListPercentListItem;
