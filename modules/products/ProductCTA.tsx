import Product from '@configs/models/product.model';
import { Button, Grid } from 'antd';
import React, { ReactNode } from 'react';
import AddToCartButton from './AddToCartButton';

function ProductCTA({
  product,
  price,
  isAvailable,
}: {
  product: Product;
  price: ReactNode;
  isAvailable?: boolean;
}) {
  const { lg } = Grid.useBreakpoint();

  return (
    <>
      <div className="hidden flex-col items-center gap-1 lg:flex">
        {product &&
          (isAvailable ? (
            <div className=" w-full md:w-[200px]">
              <AddToCartButton
                type="in-detail"
                product={product}
                className="w-[200px] uppercase"
              />
            </div>
          ) : (
            <div className=" w-full md:w-[200px]">
              <Button
                className="w-[200px] uppercase"
                type="primary"
                shape="round"
                size={'large'}
                onClick={() =>
                  window.open('https://zalo.me/phuocthienpharmacy', '_blank')
                }
              >
                Liên hệ dược sĩ
              </Button>
            </div>
          ))}
      </div>

      {!lg && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            height: 'auto',
            background: '#fff',
            boxShadow: '0 -2px 8px rgb(0 0 0 / 15%)',
            padding: '16px',
          }}
        >
          <div className="flex items-center justify-between gap-2">
            {price}

            {product && (
              <div className="w-[180px]">
                <AddToCartButton
                  type="in-detail"
                  product={product}
                  className="w-full uppercase"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCTA;
