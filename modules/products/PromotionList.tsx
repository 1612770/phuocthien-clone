import { DoubleRightOutlined, PercentageOutlined } from '@ant-design/icons';
import {
  DealPromotionModel,
  GiftPromotionModel,
  PromotionPercent,
} from '@configs/models/promotion.model';
import { Button, Typography } from 'antd';
import React, { useState } from 'react';
import PromotionListDealListItem from './PromotionListDealListItem';
import PromotionListGiftListItem from './PromotionListGiftListItem';
import PromotionListPercentListItem from './PromotionListPercentListItem';

type WithType<T> = {
  type: 'percent' | 'gift' | 'deal';
  promotion: T;
};

function PromotionList({
  promotionPercents,
  retailPrice,
  dealPromotions,
  giftPromotions,
}: {
  promotionPercents: PromotionPercent[];
  retailPrice?: number;
  dealPromotions?: DealPromotionModel[];
  giftPromotions?: GiftPromotionModel[];
}) {
  const [showMore, setShowMore] = useState(false);

  if (
    !promotionPercents.length &&
    !giftPromotions?.length &&
    !dealPromotions?.length
  )
    return null;

  const promotionsWithType: WithType<
    PromotionPercent | DealPromotionModel | GiftPromotionModel
  >[] = [
    ...promotionPercents.map((promotion) => ({
      type: 'percent' as const,
      promotion,
    })),
    ...(giftPromotions || []).map((giftPromotion) => ({
      type: 'gift' as const,
      promotion: giftPromotion,
    })),
    ...(dealPromotions || []).map((dealPromotion) => ({
      type: 'deal' as const,
      promotion: dealPromotion,
    })),
  ];

  const shouldShowSeeMoreButton = promotionsWithType.length > 4;

  const showedPromotionsWithType = showMore
    ? promotionsWithType
    : promotionsWithType.slice(0, 4);

  return (
    <div className=" flex flex-col overflow-hidden rounded-xl border border-solid border-orange-500">
      <div className="flex items-center gap-2 bg-orange-200 px-2 py-1 text-orange-500">
        <PercentageOutlined />
        <Typography.Text className="text-md font-semibold text-orange-600">
          Khuyến mãi dành riêng cho sản phẩm
        </Typography.Text>
      </div>

      <div className="grid grid-cols-1 divide-y divide-x-0 divide-solid divide-gray-200 py-1">
        {showedPromotionsWithType.map(({ type, promotion }) => {
          switch (type) {
            case 'percent':
              return (
                <PromotionListPercentListItem
                  promotion={promotion as PromotionPercent}
                  retailPrice={retailPrice}
                />
              );
            case 'gift':
              return (
                <PromotionListGiftListItem
                  retailPrice={retailPrice || 0}
                  giftPromotion={promotion as GiftPromotionModel}
                />
              );
            case 'deal':
              return (
                <PromotionListDealListItem
                  dealPromotion={promotion as DealPromotionModel}
                />
              );

            default:
              return null;
          }
        })}

        {shouldShowSeeMoreButton && (
          <Button
            icon={showMore ? null : <DoubleRightOutlined />}
            iconPosition="end"
            type="link"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? 'Thu gọn' : 'Xem thêm'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default PromotionList;
