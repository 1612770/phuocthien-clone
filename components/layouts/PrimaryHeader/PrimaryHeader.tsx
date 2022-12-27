import { Button, Input, Space, Typography } from 'antd';
import Link from 'next/link';
import { Book, MapPin, Menu, Search, ShoppingCart, User } from 'react-feather';
import PrimaryHeaderMenuItem from './PrimaryHeaderMenuItem';
import IMAGES from 'configs/assests/images';
import { useState } from 'react';
import PrimaryheaderMenuDrawer from './PrimaryheaderMenuDrawer';

function PrimaryHeader() {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openSearchMenu, setOpenSearchMenu] = useState(false);
  return (
    <header>
      <div className="bg-primary py-2">
        <div className="container m-auto flex items-center justify-between py-2">
          <div className="flex flex-1 items-center">
            <Link href="/" style={{ color: 'white' }}>
              <img
                src={IMAGES.logo}
                alt="Nhà thuốc Phước Thiện"
                className="aspect-square h-8 w-16 object-contain"
              />
            </Link>

            <Space direction="vertical" size={0} className="mr-4 w-[92px]">
              <Typography.Text className="m-0 -mb-2 inline-block text-base text-white">
                Nhà thuốc
              </Typography.Text>
              <Typography.Text strong className="uppercase text-white">
                Phước Thiện
              </Typography.Text>
            </Space>

            <Input
              placeholder="Tìm kiếm sản phẩm..."
              size="large"
              className="ml-2 hidden h-10 w-full flex-1 lg:flex"
              suffix={<Search size={20} />}
            />
          </div>

          <Space size={16}>
            <Button
              type="primary"
              className="ml-8 hidden h-10 bg-primary-dark shadow-none md:block"
            >
              <Space align="center" className="h-full w-full">
                <ShoppingCart className="text-white" size={20} />
                <Typography.Text className="text-white">
                  Giỏ hàng
                </Typography.Text>
              </Space>
            </Button>
            <Button
              type="primary"
              className="hidden h-10 bg-primary-dark shadow-none md:block"
            >
              <Space align="center" className="h-full w-full">
                <User className="text-white" width={20} height={20} />
                <Typography.Text className="text-white">
                  Lịch sử đơn hàng
                </Typography.Text>
              </Space>
            </Button>
            <Space
              align="center"
              direction="vertical"
              size={0}
              className="hidden lg:flex"
            >
              <Typography.Text className="text-center text-sm text-white">
                Hotline (08h00 - 20h30)
              </Typography.Text>
              <Typography.Text className="text-center text-base font-semibold text-yellow-500">
                1800599964
              </Typography.Text>
            </Space>

            <Button
              shape="circle"
              type="primary"
              onClick={() => setOpenSearchMenu(!openSearchMenu)}
              className="flex h-10 w-[40px] items-center justify-center shadow-none lg:hidden"
              icon={<Search size={20} className="cursor-pointer text-white" />}
            />
            <Button
              shape="circle"
              type="primary"
              onClick={() => setOpenMobileMenu(!openMobileMenu)}
              className="flex h-10 w-[40px] items-center justify-center shadow-none lg:hidden"
              icon={<Menu size={20} className="cursor-pointer text-white" />}
            />
          </Space>
        </div>
      </div>

      <div className="hidden bg-primary lg:block">
        <div className="container m-auto flex items-center justify-between p-2">
          <Space className="flex flex-1 justify-between">
            <PrimaryHeaderMenuItem label="Thuốc" />
            <PrimaryHeaderMenuItem label="Thực phẩm chức năng" />
            <PrimaryHeaderMenuItem label="Thiết bị, dụng cụ y tế" />
            <PrimaryHeaderMenuItem label="Mỹ phẩm" />
            <PrimaryHeaderMenuItem label="Chăm sóc cá nhân" />
            <PrimaryHeaderMenuItem label="Chăm sóc trẻ em" />
          </Space>
          <Typography.Text
            className="mx-4 hidden text-white xl:flex"
            type="secondary"
          >
            |
          </Typography.Text>
          <Space className="hidden xl:flex">
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
        </div>
      </div>

      <PrimaryheaderMenuDrawer
        open={openMobileMenu}
        onClose={() => {
          setOpenMobileMenu(false);
        }}
      />
    </header>
  );
}

export default PrimaryHeader;
