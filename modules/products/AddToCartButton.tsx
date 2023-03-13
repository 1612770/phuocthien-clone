import { Button, Input } from 'antd';
import Product from '@configs/models/product.model';
import { Minus, Plus } from 'react-feather';
import React from 'react';
import { useCart } from '@providers/CartProvider';

function AddToCartButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { addToCart, cartProducts, removeFromCart } = useCart();

  const productIncart = cartProducts.find(
    (cartProduct) => cartProduct.product.key === product.key
  );

  return (
    <div onClick={(e) => e.preventDefault()} className="w-full">
      {!!productIncart && (
        <div className="flex w-full items-center justify-between">
          <Input.Group className="flex w-full justify-between" compact>
            <Button
              className="min-w-[32px] rounded-lg border-none bg-green-50 disabled:bg-gray-50"
              icon={<Minus size={20} className="text-primary" />}
              disabled={productIncart.quantity <= 1}
              onClick={(e) => {
                e.preventDefault();
                if ((productIncart?.quantity || 0) > 1) {
                  addToCart({
                    product,
                    quantity: (productIncart?.quantity || 1) - 1,
                  });
                }
              }}
            />
            <Input
              className="border-none text-center font-semibold outline-none focus:shadow-none focus:outline-none"
              value={productIncart.quantity || ''}
              onChange={(e) => {
                e.preventDefault;
                addToCart({
                  product,
                  quantity: +e.target.value,
                });
              }}
              onBlur={(e) => {
                if (!e.target.value) {
                  removeFromCart(product);
                }
              }}
            />
            <Button
              className="min-w-[32px] rounded-lg border-none bg-green-50 disabled:bg-gray-50"
              disabled={productIncart.quantity >= 1000}
              icon={<Plus size={20} className="text-primary" />}
              onClick={(e) => {
                e.preventDefault;
                addToCart({
                  product,
                  quantity: (productIncart?.quantity || 1) + 1,
                });
              }}
            />
          </Input.Group>
        </div>
      )}

      {!productIncart && (
        <Button
          className={`px-4 shadow-none ${className}`}
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            addToCart({ product, quantity: 1 });
          }}
        >
          Chọn mua
        </Button>
      )}
    </div>
  );
}

export default AddToCartButton;
