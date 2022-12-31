import { Button, Input, Space, Typography } from 'antd';
import Link from 'next/link';
import { Book, MapPin, Menu, Search, ShoppingCart, User } from 'react-feather';
import PrimaryHeaderMenuItem from './PrimaryHeaderMenuItem';
import IMAGES from 'configs/assests/images';
import { useState } from 'react';
import PrimaryheaderMenuDrawer from './PrimaryheaderMenuDrawer';
import { useFullMenu } from '@providers/FullMenuProvider';
import UrlUtils from '@libs/utils/url.utils';
import PrimaryHeaderMenuAll from './PrimaryHeaderMenuAll';
import IMPORTANT_MENUS from '@configs/constants/important-menus';

function PrimaryHeader() {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openSearchMenu, setOpenSearchMenu] = useState(false);
  const { fullMenu } = useFullMenu();

  return (
    <header>
      <div className="bg-primary py-2">
        <div className="container m-auto flex items-center justify-between py-2">
          <div className="flex flex-1 items-center">
            <Link href="/" style={{ color: 'white' }}>
              <a className="flex items-center">
                <img
                  src={IMAGES.logo}
                  alt="Nhà thuốc Phước Thiện"
                  className="mr-2 h-8 object-contain"
                />

                <Space direction="vertical" size={0} className="mr-4 w-[92px]">
                  <Typography.Text className="m-0 -mb-2 inline-block text-base text-white">
                    Nhà thuốc
                  </Typography.Text>
                  <Typography.Text strong className="uppercase text-white">
                    Phước Thiện
                  </Typography.Text>
                </Space>
              </a>
            </Link>

            <Input
              placeholder="Tìm kiếm sản phẩm..."
              size="large"
              className="ml-2 hidden h-10 w-full flex-1 lg:flex"
              suffix={<Search size={20} />}
            />
          </div>

          <Space size={16}>
            <Link href="/gio-hang">
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
            </Link>
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
        <div className="container m-auto flex items-center justify-between py-2">
          <Space className="flex flex-1 justify-between">
            <PrimaryHeaderMenuAll />

            {fullMenu.map((menu) =>
              menu?.name && IMPORTANT_MENUS.includes(menu?.name) ? (
                <PrimaryHeaderMenuItem
                  productGroups={menu?.productGroups}
                  href={`/${UrlUtils.generateSlug(menu?.name, menu?.key)}`}
                  label={menu.name || ''}
                  key={menu?.key}
                />
              ) : null
            )}
          </Space>
          <Typography.Text
            className="mx-4 hidden text-white lg:flex"
            type="secondary"
          >
            |
          </Typography.Text>
          <Space className="hidden lg:flex">
            <PrimaryHeaderMenuItem
              href="/goc-suc-khoe"
              label="Góc sức khỏe"
              onlyClick
              icon={<Book className="text-white" size={16} />}
            />
            <PrimaryHeaderMenuItem
              href="/chuoi-nha-thuoc"
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
