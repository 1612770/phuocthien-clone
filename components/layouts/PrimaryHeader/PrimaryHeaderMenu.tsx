import { Popover, Space, Typography } from 'antd';
import { useState } from 'react';
import { IMPORTANT_MENU_KEYS } from '@configs/env';
import ProductGroupModel from '@configs/models/product-group.model';
import { useFullMenu } from '@providers/FullMenuProvider';
import PrimaryHeaderMenuAllPopoverContent from './PrimaryHeaderMenuAllPopoverContent';
import PrimaryHeaderMenuItem from './PrimaryHeaderMenuItem';
import MenuModel from '@configs/models/menu.model';
import LinkWrapper from '@components/templates/LinkWrapper';
import { BookOutlined, ShopOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

function PrimaryHeaderMenu() {
  const { fullMenu, open, setOpen, intoPopover } = useFullMenu();

  const [mode, setMode] = useState<'all' | 'menu' | 'none'>('none');
  const [currentMenu, setCurrentMenu] = useState<MenuModel>();
  const handleOpenMenu = (open: boolean) => {
    if (mode !== 'none') {
      setOpen(open);
    } else {
      setOpen(false);
    }
  };
  const router = useRouter();
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
      onOpenChange={handleOpenMenu}
      overlayClassName="primary-header xl:w-[1200px] lg:w-[1000px]"
    >
      <div className="relative z-10 hidden bg-primary shadow-lg lg:block">
        <div className="m-auto flex items-center justify-between lg:container ">
          {fullMenu.map((menu) =>
            menu?.name &&
            IMPORTANT_MENU_KEYS.includes((menu?.key || '').toUpperCase()) ? (
              <span
                className="inline-block py-2"
                onMouseEnter={() => {
                  setCurrentMenu(menu);
                  setMode('menu');
                }}
                key={menu?.key}
              >
                <PrimaryHeaderMenuItem
                  href={`/${menu?.seoUrl}`}
                  label={menu.name || ''}
                  productGroups={
                    (menu?.productGroups as ProductGroupModel[]) || []
                  }
                />
              </span>
            ) : null
          )}

          <LinkWrapper href={'/bai-viet'}>
            <Space
              align="center"
              onMouseEnter={() => {
                setMode('none');
              }}
            >
              <BookOutlined className="text-white" />
              <Typography.Text className="whitespace-nowrap font-medium text-white">
                Góc sức khoẻ
              </Typography.Text>
            </Space>
          </LinkWrapper>
          <Link href={'/nha-thuoc'} passHref>
            <a>
              <div style={{ color: 'white' }} className="hidden xl:flex">
                <Space
                  align="center"
                  onMouseEnter={() => {
                    setMode('none');
                  }}
                >
                  <ShopOutlined className="text-white" />
                  <Typography.Text className="whitespace-nowrap font-medium text-white">
                    Chuỗi nhà thuốc
                  </Typography.Text>
                </Space>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </Popover>
  );
}

export default PrimaryHeaderMenu;
