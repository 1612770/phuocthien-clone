import { Button, Card, Space, Tag, Typography } from 'antd';
import COLORS from 'configs/colors';

type ProductCardProps = {
  title: string;
  className?: string;
};

function ProductCard({ title, className }: ProductCardProps) {
  return (
    <Card
      cover={
        <img
          alt="product image"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        />
      }
      bodyStyle={{
        padding: '12px',
      }}
      className={`${className} relative`}
    >
      <Tag
        color={COLORS.red}
        className="absolute top-0 left-0 rounded-tr-none rounded-bl-none rounded-br-none"
      >
        -30%
      </Tag>
      <div className="relative flex flex-col">
        <Space direction="vertical" size={0}>
          <Tag color="blue">Hộp 1 vỉ x 1 viên</Tag>
          <Typography.Text className="mt-1 block min-h-[48px]">
            {title}
          </Typography.Text>
          <Typography.Text className="mt-1 block">
            <Typography.Text className="text-base font-semibold">
              100.000
              <sup className="text-sups font-semibold">đ</sup>
            </Typography.Text>
            <Typography.Text className="text-base">/hộp</Typography.Text>
          </Typography.Text>

          <Typography.Text>
            <Typography.Text className="text-sm">
              20.000
              <sup className="text-xs">đ</sup>
            </Typography.Text>
            <Typography.Text className="text-sm">/vỉ</Typography.Text>
          </Typography.Text>

          <Button
            key="add-to-cart"
            block
            className="mt-2 bg-primary-light shadow-none"
            type="primary"
          >
            Thêm vào giỏ hàng
          </Button>
        </Space>
      </div>
    </Card>
  );
}

export default ProductCard;
