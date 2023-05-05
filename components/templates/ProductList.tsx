import ProductCard from '@components/templates/ProductCard';
import Product from '@configs/models/product.model';
import React from 'react';

function ProductList({ products }: { products: Product[] }) {
  return (
    <>
      <div className="hidden  grid-cols-5 lg:grid lg:gap-2">
        {products.map((product, index) =>
          product ? (
            <div className="w-full" key={index}>
              <ProductCard product={product} />
            </div>
          ) : null
        )}
      </div>
      <div className="-mx-2 flex w-full overflow-auto pl-2 lg:hidden">
        {products.map((product, index) =>
          product ? (
            <ProductCard
              key={index}
              product={product}
              className="m-2 min-w-[240px] max-w-[240px]"
            />
          ) : null
        )}
      </div>
    </>
  );
}

export default ProductList;
