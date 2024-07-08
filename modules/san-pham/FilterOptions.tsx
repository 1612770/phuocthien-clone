import BrandModel from '@configs/models/brand.model';
import { Typography, Checkbox, Radio, Space } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
const drugTypeFilter = [
  {
    label: 'Tất cả',
    value: 'ALL',
  },
  {
    label: 'Thuốc kê đơn',
    value: 'true',
  },
  {
    label: 'Thuốc không kê đơn',
    value: 'false',
  },
];
function FilterOptions({
  productBrands,
  onFilterClick,
  showFilterIsPrescripted,
}: {
  productBrands: BrandModel[];
  onFilterClick?: () => void;
  showFilterIsPrescripted?: boolean;
}) {
  const router = useRouter();
  const selectedBrands = ((router.query.brands as string) || '')
    .split(',')
    .filter((brand) => !!brand);
  const isPrescripted = (router.query['thuoc-ke-don'] as string) || 'ALL';

  return (
    <div className="py-4">
      {showFilterIsPrescripted && (
        <div>
          <div className="flex gap-4">
            <Typography.Text className="font-medium">
              Loại thuốc
            </Typography.Text>
          </div>
          <div className="mt-2 ml-4 flex flex-col">
            <Radio.Group
              value={isPrescripted}
              onChange={(e) => {
                router.push({
                  query: {
                    ...router.query,
                    'thuoc-ke-don': e.target.value,
                  },
                });
              }}
            >
              <Space direction="vertical">
                {drugTypeFilter.map((type) => {
                  return (
                    <Radio value={type.value} key={type.value}>
                      {type.label}
                    </Radio>
                  );
                })}
              </Space>
            </Radio.Group>
            {/* {drugTypeFilter.map((type) => {
          return (
            <div key={type.label}>
              <Checkbox
                className="my-2 cursor-pointer"
                checked={isPrescripted === type.value}
                onClick={() => {
                  router.push({
                    query: {
                      ...router.query,
                      'thuoc-ke-don': type.value,
                    },
                  });
                }}
              >
                {type.label}
              </Checkbox>
            </div>
          );
        })} */}
          </div>
        </div>
      )}
      <div className="flex gap-4">
        <Typography.Text className="font-medium">Hãng sản xuất</Typography.Text>
      </div>
      <div className="mt-2 ml-4 flex flex-col">
        {productBrands.map((brand) => {
          const isActive =
            !!brand?.seoUrl && selectedBrands.includes(brand?.seoUrl || '');

          return (
            <div key={brand.key}>
              <Checkbox
                className="my-2 cursor-pointer"
                checked={isActive}
                onClick={() => {
                  onFilterClick?.();
                  if (isActive) {
                    const newBrands = selectedBrands.filter(
                      (selectedBrand) => selectedBrand !== brand.seoUrl
                    );
                    router.push({
                      query: {
                        ...router.query,
                        brands: newBrands.join(','),
                      },
                    });
                  } else {
                    router.push({
                      query: {
                        ...router.query,
                        brands: [...selectedBrands, brand.seoUrl].join(','),
                      },
                    });
                  }
                }}
              >
                {brand.name}
              </Checkbox>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FilterOptions;
