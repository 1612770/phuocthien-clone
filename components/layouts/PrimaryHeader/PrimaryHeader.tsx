import { Button, Input, Space, Typography } from 'antd';
import Link from 'next/link';
import { Book, MapPin, Search, ShoppingCart, User } from 'react-feather';
import PrimaryHeaderMenuItem from './PrimaryHeaderMenuItem';
import IMAGES from 'configs/assests/images';

type PrimaryHeaderProps = {};

// eslint-disable-next-line no-empty-pattern
function PrimaryHeader({}: PrimaryHeaderProps) {
  return (
    <header>
      <div className="bg-primary">
        <div className="container m-auto flex items-center justify-between py-2">
          <Space align="center">
            <Link href="/" style={{ color: 'white' }}>
              <img
                src={IMAGES.logo}
                alt="Nhà thuốc Phước Thiện"
                className="aspect-square h-8 w-16 object-contain"
              />
            </Link>
            <Space direction="vertical" size={0}>
              <Typography.Text className="m-0 text-base text-white">
                Nhà thuốc
              </Typography.Text>
              <Typography.Text strong className="-mt-1 uppercase text-white">
                Phước Thiện
              </Typography.Text>
            </Space>

            <Input
              placeholder="Tìm kiếm sản phẩm..."
              size="large"
              className="ml-2 w-96"
              suffix={<Search size={20} />}
            />
          </Space>

          <Space size={16}>
            <Button type="primary" className="h-10 bg-primary-dark shadow-none">
              <Space align="center" className="h-full w-full">
                <ShoppingCart className="text-white" size={20} />
                <Typography.Text className="text-white">
                  Giỏ hàng
                </Typography.Text>
              </Space>
            </Button>
            <Button type="primary" className="h-10 bg-primary-dark shadow-none">
              <Space align="center" className="h-full w-full">
                <User className="text-white" width={20} height={20} />
                <Typography.Text className="text-white">
                  Lịch sử đơn hàng
                </Typography.Text>
              </Space>
            </Button>
            <Space align="center" direction="vertical" size={0}>
              <Typography.Text className="text-center text-sm text-white">
                Hotline (08h00 - 20h30)
              </Typography.Text>
              <Typography.Text className="text-center text-base font-semibold text-yellow-500">
                1800599964
              </Typography.Text>
            </Space>
          </Space>
        </div>
      </div>

      <div className="bg-primary">
        <div className="container m-auto flex items-center justify-between p-2">
          <Space
            split={
              <Typography.Text className="text-white" type="secondary">
                |
              </Typography.Text>
            }
          >
            <Space>
              <PrimaryHeaderMenuItem label="Thuốc" />
              <PrimaryHeaderMenuItem label="Thực phẩm chức năng" />
              <PrimaryHeaderMenuItem label="Thiết bị, dụng cụ y tế" />
              <PrimaryHeaderMenuItem label="Mỹ phẩm" />
              <PrimaryHeaderMenuItem label="Chăm sóc cá nhân" />
              <PrimaryHeaderMenuItem label="Chăm sóc trẻ em" />
            </Space>
            <Space>
              <PrimaryHeaderMenuItem
                label="Góc sức khỏe"
                onlyClick
                icon={<Book className="text-white" size={16} />}
              />
              <PrimaryHeaderMenuItem
                label="Chuỗi nhà thuốc"
                onlyClick
                icon={<MapPin className="text-white" size={16} />}
              />
            </Space>
          </Space>
        </div>
      </div>
    </header>
  );
}

export default PrimaryHeader;
