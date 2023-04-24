import { PercentageOutlined, TagOutlined } from '@ant-design/icons';
import { Promotion } from '@configs/models/promotion.model';
import CurrencyUtils from '@libs/utils/currency.utils';
import TimeUtils from '@libs/utils/time.utils';
import { Typography } from 'antd';
import React from 'react';

function PromotionList({
  promotions,
  retailPrice,
}: {
  promotions: Promotion[];
  retailPrice?: number;
}) {
  return (
    <div className=" flex flex-col overflow-hidden rounded-xl border border-solid border-waring-border">
      <div className="flex items-center gap-2 bg-waring-background px-4 py-2 text-waring">
        <PercentageOutlined />
        <Typography.Text className="font-medium text-inherit">
          Khuyến mãi dành riêng cho sản phẩm
        </Typography.Text>
      </div>

      <div className="py-1">
        {promotions.map((promotion) => (
          <div
            key={promotion.promotionKey}
            className="my-2 flex items-center gap-2 px-4"
          >
            <div className="flex h-[32px] w-[32px] border-collapse items-center justify-center rounded-lg bg-primary-background">
              <TagOutlined size={20} className="text-primary" />
            </div>
            <div>
              <Typography.Paragraph className="m-0">
                Mua ít nhất {promotion.productQuantityMinCondition} sản phẩm để
                nhận khuyến mãi {promotion.val * 100}%
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
        ))}
      </div>
    </div>
  );
}

export default PromotionList;
