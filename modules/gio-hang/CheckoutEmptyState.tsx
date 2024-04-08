import { Empty, Typography, Button } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';

function CheckoutEmptyState() {
  const router = useRouter();
  return (
    <Empty
      className="mt-8"
      description={<Typography>Giỏ hàng của bạn đang trống</Typography>}
    >
      <div onClick={() => router.push(`/`)} className="cursor-pointer">
        <Button>Mua thêm sản phẩm</Button>
      </div>
    </Empty>
  );
}

export default CheckoutEmptyState;
