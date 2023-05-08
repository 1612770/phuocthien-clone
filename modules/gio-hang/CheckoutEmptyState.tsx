import { Empty, Typography, Button } from 'antd';
import Link from 'next/link';
import React from 'react';

function CheckoutEmptyState() {
  return (
    <Empty
      className="mt-8"
      description={<Typography>Giỏ hàng của bạn đang trống</Typography>}
    >
      <Link href="/">
        <a>
          <Button>Mua thêm sản phẩm</Button>
        </a>
      </Link>
    </Empty>
  );
}

export default CheckoutEmptyState;
