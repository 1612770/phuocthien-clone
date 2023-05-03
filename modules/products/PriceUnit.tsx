import CurrencyUtils from '@libs/utils/currency.utils';
import { Typography } from 'antd';
import React from 'react';

function PriceUnit({
  price,
  unit,
  discountVal,
}: {
  price?: number;
  unit?: string;
  discountVal?: number;
}) {
  if (!price) price = 0;
  if (!discountVal) discountVal = 0;
  const discountPrice = price * (1 - discountVal);

  return (
    <div>
      <div className="flex items-end">
        <Typography.Title
          level={3}
          className="m-0 -mb-[2px] font-bold text-primary"
        >
          {CurrencyUtils.format(discountPrice)}
        </Typography.Title>

        {unit && (
          <Typography.Text className="text-xl">
            &nbsp;/&nbsp;{unit}
          </Typography.Text>
        )}
      </div>
      {discountVal > 0 && (
        <Typography.Text className="m-0 -mb-[2px] text-lg text-gray-500 line-through">
          {CurrencyUtils.format(price)}
        </Typography.Text>
      )}
    </div>
  );
}

export default PriceUnit;
