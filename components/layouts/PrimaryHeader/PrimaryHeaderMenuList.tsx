import { MenuProductGroup } from '@configs/constants/listMenu';
import ProductChildGroup from '@modules/products/ProductChildGroup';
import { Empty, Space, Typography } from 'antd';

function PrimaryHeaderMenuList({
  productGroups,
  parentHref,
}: {
  productGroups: MenuProductGroup[];
  parentHref: string;
}) {
  return (
    <div className="w-full py-4">
      <Space size={[12, 8]} wrap className="p-2 px-4">
        {!!productGroups?.length &&
          productGroups?.map((productGroup) => (
            <ProductChildGroup
              href={`/${parentHref}/${productGroup.productGroupUrl}`}
              key={productGroup?.productGroupUrl}
              label={productGroup?.productGroupName || ''}
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
