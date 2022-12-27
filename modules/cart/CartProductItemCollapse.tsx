import { Collapse, Typography } from 'antd';
import Link from 'next/link';

function CartProductItemCollapse() {
  return (
    <Collapse
      defaultActiveKey={['1']}
      ghost
      className="product-cart-item-collapse"
    >
      <Collapse.Panel header="2 khuyến mãi" key="1" className="p-0">
        <Typography className="text-xs">
          Cơ hội trúng 10 Iphone 14 Pro Max 128GB màu ngẫu nhiên cho đơn hàng từ
          100.000đ (16/12/2022 - 15/01/2023){' '}
          <Link href="">
            <a>(Click để xem chi tiết)</a>
          </Link>
        </Typography>

        <Typography className="text-xs">
          Cơ hội trúng 10 Iphone 14 Pro Max 128GB màu ngẫu nhiên cho đơn hàng từ
          100.000đ (16/12/2022 - 15/01/2023)
          <Link href="">
            <a>(Click để xem chi tiết)</a>
          </Link>
        </Typography>
      </Collapse.Panel>
    </Collapse>
  );
}

export default CartProductItemCollapse;
