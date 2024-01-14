import { Popover, Space, Typography } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { IMPORTANT_MENU_KEYS } from '@configs/env';
import ProductGroupModel from '@configs/models/product-group.model';
import { useFullMenu } from '@providers/FullMenuProvider';
import PrimaryHeaderMenuAllPopoverContent from './PrimaryHeaderMenuAllPopoverContent';
import PrimaryHeaderMenuItem from './PrimaryHeaderMenuItem';
import MenuModel from '@configs/models/menu.model';
import LinkWrapper from '@components/templates/LinkWrapper';
import {
  BookOutlined,
  CaretDownOutlined,
  ShopOutlined,
} from '@ant-design/icons';

function PrimaryHeaderMenu() {
  const { fullMenu, open, setOpen, intoPopover } = useFullMenu();

  const [mode, setMode] = useState<'all' | 'menu'>('all');
  const [currentMenu, setCurrentMenu] = useState<MenuModel>();
  const handleOpenMenu = (open: boolean) => {
    setOpen(open);
  };
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
          <Space
            align="center"
            className="inline-flex cursor-pointer py-2"
            onMouseEnter={() => {
              setMode('all');
            }}
          >
            <Typography.Text className="whitespace-nowrap font-medium uppercase text-white">
              Tất cả danh mục
            </Typography.Text>
            <CaretDownOutlined size={8} className="text-white" />
          </Space>

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

          <Typography.Text
            className="mx-4 hidden text-white xl:flex"
            type="secondary"
          >
            |
          </Typography.Text>
          <LinkWrapper href={'/tin-tuc'} className="hidden xl:flex">
            <Space align="center">
              <BookOutlined className="text-white" />
              <Typography.Text className="whitespace-nowrap font-medium uppercase text-white">
                Góc tin tức
              </Typography.Text>
            </Space>
          </LinkWrapper>
          <Link href={'/nha-thuoc'} style={{ color: 'white' }}>
            <a className="hidden xl:flex">
              <Space align="center">
                <ShopOutlined className="text-white" />
                <Typography.Text className="whitespace-nowrap font-medium uppercase text-white">
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

export default PrimaryHeaderMenu;
