import Swiper from '@components/Swiper';
import ProductCard from '@components/templates/ProductCard';
import Product from '@configs/models/product.model';
import React from 'react';

function ProductList({
  products,
  forceSlide,
  forArticlePage,
}: {
  products: Product[];
  forceSlide?: boolean;
  forArticlePage?: boolean;
}) {
  return (
    <div className="w-full overflow-hidden">
      {!forceSlide && (
        <div className="hidden grid-cols-5 lg:grid lg:gap-2">
          {products.map((product, index) =>
            product ? (
              <div className="w-full" key={index}>
                <ProductCard product={product} />
              </div>
            ) : null
          )}
        </div>
      )}

      <div className={`relative ${forceSlide ? '' : 'lg:hidden'}`}>
        <Swiper
          breakpoints={{
            0: {
              slidesPerView: 2,
            },
            1080: {
              slidesPerView: 3,
            },
          }}
          slidesPerView={forArticlePage ? 3 : 5}
        >
          {products.map((product, index) =>
            product ? (
              <div className="w-full px-1" key={index}>
                <ProductCard product={product} />
              </div>
            ) : null
          )}
        </Swiper>
      </div>
    </div>
  );
}

export default ProductList;
