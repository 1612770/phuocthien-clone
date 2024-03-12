import { CheckCircleFilled } from '@ant-design/icons';
import { useCart } from '@providers/CartProvider';
import { Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';

function CartPopupContent() {
  const {
    cartProducts,
    cartCombos,
    cartDeals,
    cartGifts,
    recentAddedToCartType,
  } = useCart();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <div>
        <div className="flex">
          <CheckCircleFilled className="text-green-500" />
          <Typography.Text className="ml-2">
            Thêm vào giỏ hàng thành công
          </Typography.Text>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Typography.Text>
          {recentAddedToCartType === 'combo'
            ? cartCombos.length
            : recentAddedToCartType === 'gift'
            ? cartGifts.length
            : recentAddedToCartType === 'deal'
            ? cartDeals.length
            : recentAddedToCartType === 'product'
            ? cartProducts.length
            : ''}{' '}
          {recentAddedToCartType === 'combo'
            ? 'combo'
            : recentAddedToCartType === 'gift'
            ? 'quà tặng'
            : recentAddedToCartType === 'deal'
            ? 'deal'
            : recentAddedToCartType === 'product'
            ? 'sản phẩm'
            : ''}
        </Typography.Text>

        <Button
          type="primary"
          className="shadow-none"
          onClick={() => {
            router.push('/gio-hang');
          }}
        >
          Xem giỏ hàng
        </Button>
      </div>
    </div>
  );
}

export default CartPopupContent;
