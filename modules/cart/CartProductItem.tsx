import { Button, Input, Space, Typography } from 'antd';
import { Minus, Plus, X } from 'react-feather';
import CartProductItemCollapse from './CartProductItemCollapse';

function CartProductItem() {
  return (
    <div className="my-8 flex justify-between ">
      <div className="flex  flex-col">
        <img
          src="https://cdn.tgdd.vn/Products/Images/10253/285132/hon-dich-men-vi-sinh-livespo-colon-ho-tro-dieu-tri-viem-dai-trang-thumb-1-1-200x200.jpg"
          alt="product image"
          className="aspect-square w-[80px]"
        />
        <Button
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
          <Typography.Text>
            Men vi sinh LiveSpo Colon hỗ trợ điều trị viêm đại tràng
          </Typography.Text>

          <CartProductItemCollapse />
        </div>
        <div className="meta flex flex-col">
          <Typography.Text className="text-right">
            <Typography.Text className="text-sm font-semibold">
              20.000
              <sup className="text-xs">đ</sup>
            </Typography.Text>
            <Typography.Text className="text-sm">/vỉ</Typography.Text>
          </Typography.Text>

          <Space size={4} className="mt-1">
            <Button icon={<Minus size={20} />}></Button>
            <Input className="w-[40px]" value={1}></Input>
            <Button icon={<Plus size={20} />}></Button>
          </Space>
        </div>
      </div>
    </div>
  );
}

export default CartProductItem;
