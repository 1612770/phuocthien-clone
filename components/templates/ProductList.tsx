import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import ProductCard from '@components/templates/ProductCard';
import Product from '@configs/models/product.model';
import { Button, Carousel } from 'antd';
import React from 'react';

function ProductList({
  products,
  forceSlide,
}: {
  products: Product[];
  forceSlide?: boolean;
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
        <Carousel
          infinite={products.length > 5}
          arrows={true}
          responsive={[
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: products.length > 2,
              },
            },
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: products.length > 3,
              },
            },
          ]}
          slidesToShow={5}
          slidesToScroll={5}
          dots={false}
          nextArrow={
            <div className="">
              <Button
                shape="circle"
                size="large"
                className="z-10 translate-x-[-60px] translate-y-[-10px]"
              >
                <RightOutlined />
              </Button>
            </div>
          }
          prevArrow={
            <div className="">
              <Button
                shape="circle"
                size="large"
                className="z-10 translate-x-[40px] translate-y-[-10px]"
              >
                <LeftOutlined />
              </Button>
            </div>
          }
        >
          {products.map((product, index) =>
            product ? (
              <div className="w-full px-1" key={index}>
                <ProductCard product={product} />
              </div>
            ) : null
          )}
        </Carousel>
      </div>
    </div>
  );
}

export default ProductList;
