import ProductGroupModel from '@configs/models/product-group.model';
import ProductChildGroup from '@modules/products/ProductChildGroup';
import { Empty, Space, Typography } from 'antd';
import { memo } from 'react';

function PrimaryHeaderMenuList({
  productGroups,
  parentHref,
}: {
  productGroups: ProductGroupModel[];
  parentHref: string;
}) {
  return (
    <div className="w-full py-4">
      <Space size={[12, 8]} wrap className="p-2 px-4">
        {!!productGroups?.length &&
          productGroups?.map((productGroup) => (
            <ProductChildGroup
              href={`/${parentHref}/${productGroup.seoUrl}`}
              key={productGroup?.key}
              label={productGroup?.name || ''}
            />
          ))}
      </Space>
      {!productGroups?.length && (
        <div className="mb-4 flex h-full w-full items-center justify-center">
          <Empty
            description={<Typography>Không có danh mục nào</Typography>}
          ></Empty>
        </div>
      )}
    </div>
  );
}

export default PrimaryHeaderMenuList;
