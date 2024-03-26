import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import ProductCard from '@components/templates/ProductCard';
import Product from '@configs/models/product.model';
import { Button, Carousel } from 'antd';
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
        <Carousel
          infinite={forArticlePage ? true : products.length > 5}
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
                slidesToShow: forArticlePage ? 2 : 3,
                slidesToScroll: forArticlePage ? 2 : 3,
                infinite: forArticlePage ? true : products.length > 3,
              },
            },
          ]}
          slidesToShow={forArticlePage ? 3 : 5}
          slidesToScroll={forArticlePage ? 3 : 5}
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
