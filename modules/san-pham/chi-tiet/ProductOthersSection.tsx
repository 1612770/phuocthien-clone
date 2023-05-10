import ProductList from '@components/templates/ProductList';
import Product from '@configs/models/product.model';
import { Typography } from 'antd';
import React from 'react';

function ProductOthersSection({
  name,
  products,
}: {
  name: string;
  products: Product[];
}) {
  return (
    <>
      <Typography.Title
        level={3}
        className="mb-0 mt-6 inline-block font-medium uppercase lg:mb-4 lg:mt-12"
      >
        Các sản phẩm cùng loại{' '}
      </Typography.Title>
      <Typography.Title
        level={3}
        className="hidden font-medium uppercase lg:inline-block"
      >
        trong nhóm {name}
      </Typography.Title>
      {(products?.length || 0) > 0 && <ProductList products={products || []} />}
    </>
  );
}

export default ProductOthersSection;
