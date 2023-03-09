import { Popover, Space, Typography } from 'antd';
import Link from 'next/link';
import { Book, ChevronDown, MapPin } from 'react-feather';
import { useState } from 'react';
import { IMPORTANT_MENUS } from '@configs/env';
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
            menu?.name &&
            IMPORTANT_MENUS.includes(menu?.name.toLocaleLowerCase()) ? (
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
          <Link href={'/nha-thuoc'} style={{ color: 'white' }}>
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

export default PrimaryHeaderMenu;
