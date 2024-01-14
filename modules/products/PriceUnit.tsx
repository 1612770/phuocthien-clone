import COLORS from '@configs/colors';
import CurrencyUtils from '@libs/utils/currency.utils';
import { Tag, Typography } from 'antd';
import React from 'react';

function PriceUnit({
  price,
  unit,
  discountVal,
  size = 'default',
}: {
  price?: number;
  unit?: string;
  discountVal?: number;
  size?: 'default' | 'small';
}) {
  if (!price) price = 0;
  if (!discountVal) discountVal = 0;
  const discountPrice = price * (1 - discountVal);

  return (
    <div className="mr-8">
      <div className="flex items-end">
        <Typography.Title
          level={size === 'small' ? 5 : 3}
          className="m-0 -mb-[2px] font-bold text-primary"
        >
          {CurrencyUtils.format(discountPrice)}
        </Typography.Title>

        {unit && (
          <Typography.Text className={size === 'small' ? 'text-sm' : 'text-xl'}>
            &nbsp;/&nbsp;{unit}
          </Typography.Text>
        )}
      </div>
      {discountVal > 0 && (
        <Typography.Text
          className={`m-0 -mb-[2px] text-gray-500 line-through ${
            size === 'small' ? 'text-sm' : 'text-lg'
          }`}
        >
          {CurrencyUtils.format(price)}
          <Tag
            color={COLORS.red}
            className="m-0 mt-[-2px] ml-2 rounded-full align-middle text-xs"
          >
            -{discountVal * 100}%
          </Tag>
        </Typography.Text>
      )}
    </div>
  );
}

export default PriceUnit;
