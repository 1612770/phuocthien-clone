import Breadcrumbs from '@components/Breadcrumbs';
import ProductGroup from '@modules/categories/ProductGroup';
import { useFullMenu } from '@providers/FullMenuProvider';
import { Empty, Typography } from 'antd';

function ProductTypePage({
  productTypeSeoUrlToGetFromFullMenu,
}: {
  productTypeSeoUrlToGetFromFullMenu?: string;
}) {
  const { fullMenu } = useFullMenu();

  const productType = (fullMenu || []).find((menu) => {
    return menu.seoUrl === productTypeSeoUrlToGetFromFullMenu;
  });

  return (
    <div className="grid px-4 pb-4 lg:container lg:px-0">
      <Breadcrumbs
        className="mt-4 mb-2"
        breadcrumbs={[
          {
            title: 'Trang chủ',
            path: '/',
          },
          {
            title: productType?.name,
          },
        ]}
      ></Breadcrumbs>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6 md:gap-4 lg:grid-cols-6 xl:grid-cols-8">
        {productType?.productGroups?.map((productGroup) => (
          <ProductGroup
            key={productGroup?.key}
            productGroup={productGroup}
            href={`/${productType.seoUrl}/${productGroup?.seoUrl}`}
          />
        ))}
      </div>

      {!productType?.productGroups?.length && (
        <div className="flex min-h-[400px] w-full items-center justify-center py-8">
          <Empty
            description={<Typography>Không tìm thấy danh mục nào</Typography>}
          ></Empty>
        </div>
      )}
    </div>
  );
}

export default ProductTypePage;
