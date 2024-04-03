import { PercentageOutlined } from '@ant-design/icons';
import { PromotionPercent } from '@configs/models/promotion.model';
import { GiftPromotion, DealPromotion } from '@libs/client/Promotion';
import { Typography } from 'antd';
import React from 'react';
import PromotionListGiftListItem from './PromotionListGiftListItem';
import PromotionListDealListItem from './PromotionListDealListItem';
import PromotionListPercentListItem from './PromotionListPercentListItem';

function PromotionList({
  promotionPercents,
  retailPrice,
  giftPromotions,
  dealPromotions,
}: {
  promotionPercents: PromotionPercent[];
  retailPrice?: number;
  giftPromotions?: GiftPromotion[];
  dealPromotions?: DealPromotion[];
}) {
  return promotionPercents.length > 0 ||
    (giftPromotions?.length && giftPromotions?.length > 0) ||
    (dealPromotions?.length && dealPromotions?.length > 0) ? (
    <div className=" flex flex-col overflow-hidden rounded-xl border border-solid border-waring-border">
      <div className="flex items-center gap-2 bg-waring-background px-4 py-2 text-waring">
        <PercentageOutlined />
        <Typography.Text className="font-medium text-inherit">
          Khuyến mãi dành riêng cho sản phẩm
        </Typography.Text>
      </div>

      <div className="grid grid-cols-1 divide-y divide-x-0 divide-solid divide-gray-200 py-1">
        {promotionPercents.map((promotion) => (
          <PromotionListPercentListItem
            promotion={promotion}
            key={promotion.promotionKey}
            retailPrice={retailPrice}
          />
        ))}

        {giftPromotions?.map((giftPromotion) => (
          <PromotionListGiftListItem
            giftPromotion={giftPromotion}
            key={giftPromotion.promotionGiftId}
          />
        ))}

        {dealPromotions?.map((dealPromotion) => (
          <PromotionListDealListItem
            dealPromotion={dealPromotion}
            key={dealPromotion.promotionDealId}
          />
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
}

export default PromotionList;
