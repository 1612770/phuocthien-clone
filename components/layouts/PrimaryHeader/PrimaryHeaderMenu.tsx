import { Popover, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import PrimaryHeaderMenuAllPopoverContent from './PrimaryHeaderMenuAllPopoverContent';
import PrimaryHeaderMenuItem from './PrimaryHeaderMenuItem';
import { ProductTypeGroupCategory } from '@configs/models/menu.model';
import LinkWrapper from '@components/templates/LinkWrapper';
import { BookOutlined, ShopOutlined } from '@ant-design/icons';
import Link from 'next/link';
import {
  fetchDataFirstSlugs,
  listMenu,
  MenuProductType,
} from '@configs/constants/listMenu';
import { useRouter } from 'next/router';
import { GeneralClient } from '@libs/client/General';

function PrimaryHeaderMenu() {
  // const { fullMenu, open, setOpen, intoPopover } = useFullMenu();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'all' | 'menu' | 'none'>('none');
  const [dataFullMenu, setDataFullMenu] = useState<ProductTypeGroupCategory[]>(
    []
  );
  const [currentMenu, setCurrentMenu] = useState<MenuProductType>(listMenu[0]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const client = new GeneralClient(null, {});
      const res = await client.getCategoryProduct({
        slugs: fetchDataFirstSlugs,
        maxProductResult: 5,
      });
      if (res.status === 'OK' && res.data) {
        setDataFullMenu(res.data);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    setMode('none');
  }, [router.asPath]);
  useEffect(() => {
    if (mode !== 'none') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [mode]);
  return (
    <Popover
      open={open}
      align={{
        offset: [0, 0],
      }}
      content={
        <PrimaryHeaderMenuAllPopoverContent
          currentMenu={currentMenu}
          dataMenu={dataFullMenu.filter(
            (el) => el.productTypeSeoUrl === currentMenu.productTypeUrl
          )}
        />
      }
      placement="bottom"
      // destroyTooltipOnHide
      showArrow={false}
      trigger={'hover'}
      onOpenChange={(open) => {
        if (mode !== 'none') {
          setOpen(open);
        } else {
          setOpen(false);
        }
      }}
      overlayClassName="primary-header xl:w-[1200px] lg:w-[1000px]"
    >
      <div className="relative z-10 hidden bg-primary shadow-lg lg:block">
        <div className="m-auto flex items-center justify-between lg:container ">
          {listMenu.map((menu) => (
            <span
              className="inline-block py-2"
              onMouseEnter={() => {
                setCurrentMenu(menu);
                setMode('menu');
              }}
              key={menu?.productTypeUrl}
            >
              <PrimaryHeaderMenuItem
                href={`/${menu?.productTypeUrl}`}
                label={menu.productTypeName || ''}
                productGroups={menu?.productGroups || []}
              />
            </span>
          ))}

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
