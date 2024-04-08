import { Badge, Button, Input, Popover, Space, Typography } from 'antd';
import { Menu, Search, ShoppingCart, User } from 'react-feather';
import IMAGES from 'configs/assests/images';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@providers/CartProvider';
import { useRouter } from 'next/router';
import PrimaryHeaderMenu from './PrimaryHeaderMenu';
import ProductSearchInput from './ProductSearchInput';
import ProductSearchInputMobile from './ProductSearchInputMobile';
import PrimaryHeaderMenuDrawer from './MenuDrawer';
import { useIntersectionObserver } from '@libs/utils/hooks';
import CartPopupContent from '@modules/gio-hang/CartPopupContent';
import CurrencyUtils from '@libs/utils/currency.utils';
import { useFullMenu } from '@providers/FullMenuProvider';
import { MenuSkeleton } from '@components/templates/Skeleton/Menu';

function PrimaryHeader({ showSearch = true }) {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openMobileSearch, setOpenMobileSearch] = useState(false);
  const {
    cartProducts,
    cartCombos,
    cartDeals,
    cartGifts,
    setModeShowPopup,
    modeShowPopup,
    isOpenNotification,
    totalPrice,
  } = useCart();
  const router = useRouter();
  const cartButtonRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(cartButtonRef, {});
  const isVisible = !!entry?.isIntersecting;

  const totalProducts =
    cartProducts.length +
    cartCombos.length +
    cartDeals.length +
    cartGifts.length;

  useEffect(() => {
    if (isVisible) {
      setModeShowPopup('cart-button');
    } else {
      setModeShowPopup('fixed');
    }
  }, [isVisible, setModeShowPopup]);
  const { fullMenu } = useFullMenu();
  return (
    <header>
      <div className="bg-white py-4">
        <div className="m-auto flex items-center justify-between px-2  lg:container lg:px-0">
          <div className="flex flex-1 items-center">
            <Menu
              size={40}
              className="mr-2 cursor-pointer text-primary lg:hidden"
              onClick={() => setOpenMobileMenu(!openMobileMenu)}
            />

            <div
              className="w-[200px] cursor-pointer px-1 pb-2 lg:min-w-[128px]"
              onClick={() => router.push('/')}
            >
              <img
                src={IMAGES.logo}
                alt="Nhà thuốc Phước Thiện"
                className="w-full "
              />
            </div>

            {showSearch && (
              <div className="ml-4 hidden h-10 w-full flex-1 lg:block">
                <ProductSearchInput />
              </div>
            )}
          </div>

          <div
            className="mr-2 block cursor-pointer md:hidden"
            onClick={() => router.push({ pathname: '/gio-hang' })}
          >
            <Badge count={totalProducts}>
              <ShoppingCart className="text-primary" size={32} />
            </Badge>
          </div>

          <Space size={0} className="hidden md:flex">
            <Popover
              content={<CartPopupContent />}
              open={modeShowPopup === 'cart-button' && isOpenNotification}
            >
              <div
                onClick={() => router.push('/gio-hang')}
                className="hidden md:block"
                ref={cartButtonRef}
              >
                <Badge count={totalProducts}>
                  <Button className="ml-8 h-12 min-w-[64px] shadow-none">
                    <div className="flex items-center justify-between">
                      <ShoppingCart size={28} className="text-primary" />
                      <div className="column ml-2 flex flex-col">
                        <div
                          className={`${
                            totalPrice > 0 ? 'text-xs' : 'text-sm'
                          }`}
                        >
                          Giỏ hàng
                        </div>
                        {totalPrice > 0 && (
                          <div className="text-primary">
                            {CurrencyUtils.format(totalPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Button>
                </Badge>
              </div>
            </Popover>

            <div
              onClick={() => router.push('/lich-su-don-hang')}
              className="ml-4 inline-block"
            >
              <Button className="hidden h-12  shadow-none md:block">
                <div className="flex items-center justify-between text-center">
                  <User size={28} className="text-primary" />
                  <Typography.Text className="ml-2 text-sm">
                    Lịch sử
                    <br />
                    đơn hàng
                  </Typography.Text>
                </div>
              </Button>
            </div>

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
                <Typography.Text className="text-center text-sm font-bold text-primary">
                  Hotline (07h00 - 21h00)
                </Typography.Text>
                <Typography.Text className="text-center text-base font-bold text-orange-600">
                  1800 599 964
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

      {fullMenu.length > 0 ? (
        <PrimaryHeaderMenu></PrimaryHeaderMenu>
      ) : (
        <MenuSkeleton />
      )}

      {fullMenu.length > 0 && (
        <PrimaryHeaderMenuDrawer
          open={openMobileMenu}
          onClose={() => {
            setOpenMobileMenu(false);
          }}
        />
      )}

      {modeShowPopup === 'fixed' && (
        <div
          className={`fixed left-[32px] right-[32px] bottom-[32px] z-[10000] rounded-xl bg-white p-4 shadow-lg transition-all duration-1000 ease-in-out sm:left-auto`}
          style={{
            visibility: isOpenNotification ? 'visible' : 'hidden',
            transform: isOpenNotification
              ? 'translateY(0)'
              : 'translateY(100%)',
            opacity: isOpenNotification ? 1 : 0,
          }}
        >
          <CartPopupContent />
        </div>
      )}
    </header>
  );
}

export default PrimaryHeader;
