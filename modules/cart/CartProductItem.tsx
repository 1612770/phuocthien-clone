import { Button, Input, Space, Typography } from 'antd';
import { Minus, Plus, X } from 'react-feather';
import CartProductItemCollapse from './CartProductItemCollapse';
import Product from '@configs/models/product.model';
import { useCart } from '@providers/CartProvider';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';

function CartProductItem({
  cartProduct,
}: {
  cartProduct: { product: Product; quantity: number };
}) {
  const { removeFromCart, changeProductQuantity } = useCart();

  return (
    <div className="my-8 flex justify-between ">
      <div className="flex flex-col">
        <div className="relative mr-4 h-[80px] w-[80px]">
          <ImageWithFallback
            src={cartProduct.product.detail?.image || ''}
            alt="product image"
            getMockImage={() => {
              return ImageUtils.getRandomMockProductImageUrl();
            }}
            layout="fill"
          />
        </div>
        <Button
          onClick={() => removeFromCart(cartProduct.product)}
          size="small"
          type="ghost"
          icon={<X size={16} className="mb-[2px] align-middle" />}
          className="mt-2 bg-gray-200 p-0"
        >
          Xóa
        </Button>
      </div>
      <div className="flex flex-grow flex-wrap gap-2">
        <div className="flex flex-grow basis-[300px] flex-col">
          <Typography.Text>{cartProduct.product.name}</Typography.Text>

          <CartProductItemCollapse />
        </div>
        <div className="meta flex flex-col">
          <Typography.Text className="text-right">
            <Typography.Text className="text-sm font-semibold">
              {cartProduct.product.retailPrice?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              })}
            </Typography.Text>
            {cartProduct.product.unit && (
              <Typography.Text className="text-sm">
                /{cartProduct.product.unit}
              </Typography.Text>
            )}
          </Typography.Text>

          <Space size={4} className="mt-1">
            <Button
              icon={<Minus size={20} />}
              disabled={cartProduct.quantity <= 1}
              onClick={() => {
                if (cartProduct.quantity > 1)
                  changeProductQuantity(
                    cartProduct.product,
                    cartProduct.quantity - 1
                  );
              }}
            ></Button>
            <Input
              className="w-[40px]"
              value={cartProduct.quantity || ''}
              onChange={(e) => {
                changeProductQuantity(cartProduct.product, +e.target.value);
              }}
            ></Input>
            <Button
              icon={<Plus size={20} />}
              onClick={() =>
                changeProductQuantity(
                  cartProduct.product,
                  cartProduct.quantity + 1
                )
              }
            ></Button>
          </Space>
        </div>
      </div>
    </div>
  );
}

export default CartProductItem;
