import React, { useState } from 'react';
import ProductImageCarouselModal from '@modules/san-pham/chi-tiet/ProductImageCarouselModal';
import ProductImageCarousel from '@modules/san-pham/chi-tiet/ProductImageCarousel';

function ProductCarousel({ images }: { images: string[] }) {
  const [expandedAtIndex, setExpandedAtIndex] = useState<number>();
  return (
    <>
      <ProductImageCarousel
        images={images}
        onExpand={(index) => {
          setExpandedAtIndex(index);
        }}
      ></ProductImageCarousel>
      <ProductImageCarouselModal
        images={images}
        title="Ảnh sản phẩm"
        open={expandedAtIndex !== undefined}
        defaultActiveIndex={expandedAtIndex}
        onCancel={() => {
          setExpandedAtIndex(undefined);
        }}
      ></ProductImageCarouselModal>
    </>
  );
}

export default ProductCarousel;
