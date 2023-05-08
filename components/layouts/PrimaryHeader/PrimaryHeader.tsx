import { Badge, Button, Input, Space, Typography } from 'antd';
import Link from 'next/link';
import { Menu, Search, ShoppingCart, User } from 'react-feather';
import IMAGES from 'configs/assests/images';
import { useState } from 'react';
import { useCart } from '@providers/CartProvider';
import { useRouter } from 'next/router';
import PrimaryHeaderMenu from './PrimaryHeaderMenu';
import ProductSearchInput from './ProductSearchInput';
import ProductSearchInputMobile from './ProductSearchInputMobile';
import PrimaryHeaderMenuDrawer from './MenuDrawer';

function PrimaryHeader({ showSearch = true }) {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openMobileSearch, setOpenMobileSearch] = useState(false);

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
                  className="aspect-[21/16] h-8 min-h-[48px] lg:min-h-[68px]"
                />

                <Space direction="vertical" size={0} className="mr-4 w-[92px]">
                  <Typography.Text className="m-0 -mb-2 inline-block text-base text-white">
                    Nhà thuốc
                  </Typography.Text>
                  <Typography.Text
                    strong
                    className="whitespace-nowrap uppercase text-white"
                  >
                    Phước Thiện
                  </Typography.Text>
                </Space>
              </a>
            </Link>

            {showSearch && (
              <div className="hidden h-10 w-full flex-1 lg:block">
                <ProductSearchInput />
              </div>
            )}
          </div>

          <Link href="/gio-hang">
            <a className="mr-2 block md:hidden">
              <Badge count={cartProducts.length}>
                <ShoppingCart className="text-white" size={32} />
              </Badge>
            </a>
          </Link>

          <Space size={0} className="hidden md:flex">
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
              <a className="ml-4 inline-block">
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
              <a
                href="tel:1800599964"
                className="ml-4 inline-flex flex-col text-center"
              >
                <Typography.Text className="text-center text-sm text-white">
                  Hotline (08h00 - 20h30)
                </Typography.Text>
                <Typography.Text className="text-center text-base font-semibold text-yellow-500">
                  1800599964
                </Typography.Text>
              </a>
            </Space>
          </Space>
        </div>

        <div className="mt-2 block px-2 lg:container lg:hidden">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            size="large"
            value={router.query['tu-khoa'] || ''}
            className={`h-10 rounded-tl-md rounded-tr-md rounded-bl-md rounded-br-md px-4`}
            suffix={<Search size={20} />}
            onClick={() => {
              setOpenMobileSearch(true);
            }}
          />

          {openMobileSearch && (
            <ProductSearchInputMobile
              onBack={() => {
                setOpenMobileSearch(false);
                return undefined;
              }}
            />
          )}
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
