import { List, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';

function ProductBonusSection() {
  return (
    <div className="my-4 rounded-lg border border-solid border-gray-200 py-2 px-4">
      <Typography className="font-medium">Khuyến mãi</Typography>

      <List>
        <List.Item className="py-2 px-0">
          <Typography className="text-sm">
            Cơ hội trúng 10 Iphone 14 Pro Max 128GB màu ngẫu nhiên cho đơn hàng
            từ 100.000đ (16/12/2022 - 15/01/2023){' '}
            <Link href="">
              <a>(Click để xem chi tiết)</a>
            </Link>
          </Typography>
        </List.Item>

        <List.Item className="py-2 px-0">
          <Typography className="text-sm">
            Cơ hội trúng 10 Iphone 14 Pro Max 128GB màu ngẫu nhiên cho đơn hàng
            từ 100.000đ (16/12/2022 - 15/01/2023){' '}
            <Link href="">
              <a>(Click để xem chi tiết)</a>
            </Link>
          </Typography>
        </List.Item>
      </List>
    </div>
  );
}

export default ProductBonusSection;
