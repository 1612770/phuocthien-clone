import { Badge, Button, Input, Popover, Space, Typography } from 'antd';
import Link from 'next/link';
import {
  Book,
  ChevronDown,
  MapPin,
  Menu,
  Search,
  ShoppingCart,
  User,
} from 'react-feather';
import IMAGES from 'configs/assests/images';
import { useState } from 'react';
import PrimaryHeaderMenuDrawer from './PrimaryHeaderMenuDrawer';
import { useCart } from '@providers/CartProvider';
import { useRouter } from 'next/router';
import IMPORTANT_MENUS from '@configs/constants/important-menus';
import ProductGroupModel from '@configs/models/product-group.model';
import UrlUtils from '@libs/utils/url.utils';
import { useFullMenu } from '@providers/FullMenuProvider';
import PrimaryHeaderMenuAllPopoverContent from './PrimaryHeaderMenuAllPopoverContent';
import PrimaryHeaderMenuItem from './PrimaryHeaderMenuItem';
import MenuModel from '@configs/models/menu.model';

function PrimaryHeaderMenu() {
  const { fullMenu, open, setOpen, intoPopover } = useFullMenu();

  const [mode, setMode] = useState<'all' | 'menu'>('all');
  const [currentMenu, setCurrentMenu] = useState<MenuModel>();

  return (
    <Popover
      open={open || intoPopover}
      align={{
        offset: [0, 0],
      }}
      content={
        <PrimaryHeaderMenuAllPopoverContent
          currentMenu={currentMenu}
          mode={mode}
        />
      }
      placement="bottom"
      destroyTooltipOnHide
      showArrow={false}
      popupVisible={true}
      overlayClassName="primary-header xl:w-[1200px] lg:w-[1000px]"
    >
      <div className="relative z-10 hidden bg-white shadow-lg lg:block">
        <div className="m-auto flex items-center justify-between lg:container">
          <Space
            align="center"
            className="inline-flex cursor-pointer py-2"
            onMouseLeave={() => {
              setOpen(false);
            }}
            onMouseEnter={() => {
              setOpen(true);
              setMode('all');
            }}
          >
            <Typography.Text className="whitespace-nowrap font-medium uppercase">
              Tất cả danh mục
            </Typography.Text>
            <ChevronDown className="-ml-1" size={16} />
          </Space>

          {fullMenu.map((menu) =>
            menu?.name && IMPORTANT_MENUS.includes(menu?.name) ? (
              <span
                className="inline-block py-2"
                onMouseLeave={() => {
                  setOpen(false);
                }}
                onMouseEnter={() => {
                  setOpen(true);
                  setCurrentMenu(menu);
                  setMode('menu');
                }}
                key={menu?.key}
              >
                <PrimaryHeaderMenuItem
                  href={`/${UrlUtils.generateSlug(menu?.name, menu?.key)}`}
                  label={menu.name || ''}
                  productGroups={
                    (menu?.productGroups as ProductGroupModel[]) || []
                  }
                />
              </span>
            ) : null
          )}

          <Typography.Text className="mx-4 hidden xl:flex" type="secondary">
            |
          </Typography.Text>
          <Link href={'/goc-suc-khoe'} style={{ color: 'white' }}>
            <a className="hidden xl:flex">
              <Space align="center">
                <Book className="text-stone-800" size={16} />
                <Typography.Text className="whitespace-nowrap font-medium uppercase ">
                  Góc sức khỏe
                </Typography.Text>
              </Space>
            </a>
          </Link>
          <Link href={'/chuoi-nha-thuoc'} style={{ color: 'white' }}>
            <a className="hidden xl:flex">
              <Space align="center">
                <MapPin className="text-stone-800" size={16} />
                <Typography.Text className="whitespace-nowrap font-medium uppercase ">
                  Chuỗi nhà thuốc
                </Typography.Text>
              </Space>
            </a>
          </Link>
        </div>
      </div>
    </Popover>
  );
}

function PrimaryHeader() {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const { cartProducts } = useCart();
  const router = useRouter();

  return (
    <header>
      <div className="bg-primary py-4">
        <div className="m-auto flex items-center justify-between px-2  lg:container lg:px-0">
          <div className="flex flex-1 items-center">
            <Menu
              size={40}
              className="mr-2 cursor-pointer text-white lg:hidden"
              onClick={() => setOpenMobileMenu(!openMobileMenu)}
            />

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

            {router.asPath !== '/' && (
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                size="large"
                className="ml-2 hidden h-10 w-full flex-1 lg:flex"
                suffix={<Search size={20} />}
              />
            )}
          </div>

          <Link href="/gio-hang">
            <a className="mr-2 block md:hidden">
              <Badge count={cartProducts.length}>
                <ShoppingCart className="text-white" size={32} />
              </Badge>
            </a>
          </Link>

          <Space size={16} className="hidden md:flex">
            <Link href="/gio-hang">
              <a className="hidden md:block">
                <Badge count={cartProducts.length}>
                  <Button
                    type="primary"
                    className="ml-8 h-10 bg-primary-dark shadow-none "
                  >
                    <Space align="center" className="h-full w-full">
                      <ShoppingCart className="text-white" size={20} />
                      <Typography.Text className="text-white">
                        Giỏ hàng
                      </Typography.Text>
                    </Space>
                  </Button>
                </Badge>
              </a>
            </Link>

            <Link href={'/lich-su-don-hang'}>
              <a>
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
              </a>
            </Link>

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
          </Space>
        </div>

        <div className="block px-2 lg:container lg:hidden">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            size="large"
            className="mt-2 h-10 w-full flex-1 rounded-full"
            suffix={<Search size={20} />}
          />
        </div>
      </div>

      <PrimaryHeaderMenu></PrimaryHeaderMenu>

      <PrimaryHeaderMenuDrawer
        open={openMobileMenu}
        onClose={() => {
          setOpenMobileMenu(false);
        }}
      />
    </header>
  );
}

export default PrimaryHeader;
