import { Empty, List, Space, Typography } from 'antd';
import { useFullMenu } from '@providers/FullMenuProvider';
import ImageUtils from '@libs/utils/image.utils';
import { useEffect, useState } from 'react';
import Menu from '@configs/models/menu.model';
import ProductChildGroup from '@modules/products/ProductChildGroup';
import UrlUtils from '@libs/utils/url.utils';
import Link from 'next/link';

function PrimaryHeaderMenuAllPopoverContent() {
  const { fullMenu } = useFullMenu();
  const [currentFocusMenu, setCurrentFocusMenu] = useState<Menu>();

  useEffect(() => {
    if (fullMenu.length) {
      setCurrentFocusMenu(fullMenu[0]);
    }
  }, [fullMenu]);

  return (
    <div className="flex bg-primary-background">
      <List className="min-w-[320px] bg-white">
        {fullMenu.map((menu) => (
          <Link
            href={`/${UrlUtils.generateSlug(menu?.name, menu?.key)}`}
            key={menu?.key}
          >
            <a
              className={
                menu?.key === currentFocusMenu?.key
                  ? `border-b-1 border-t-1 block cursor-pointer border-l-0 border-solid border-t-green-200 border-b-green-200 border-r-primary-background bg-primary-background first:border-t-primary-background last:border-b-primary-background hover:border-r-primary-background hover:border-t-green-200 hover:border-b-green-200 hover:bg-primary-background first:hover:border-t-primary-background last:hover:border-b-primary-background`
                  : `border-b-1 border-t-1 block cursor-pointer border-l-0 border-solid border-t-white border-b-white border-r-green-200 hover:border-r-primary-background hover:border-t-green-200 hover:border-b-green-200 hover:bg-primary-background first:hover:border-t-primary-background last:hover:border-b-primary-background`
              }
            >
              <List.Item
                onMouseEnter={() => {
                  setCurrentFocusMenu(menu);
                }}
              >
                <img
                  src={ImageUtils.getFullMenuImageUrl(menu?.image)}
                  alt={menu?.name}
                  onError={(e) => {
                    e.currentTarget.src = ImageUtils.getRandomMockMenuUrl();
                  }}
                  className="mr-2 aspect-square w-8"
                />
                {menu?.name}
              </List.Item>
            </a>
          </Link>
        ))}
      </List>
      <div className="w-full">
        <Space size={[12, 8]} wrap className="p-4">
          {!!currentFocusMenu?.productGroups?.length &&
            currentFocusMenu?.productGroups?.map((productGroup) => (
              <ProductChildGroup
                href={`/${UrlUtils.generateSlug(
                  currentFocusMenu?.name,
                  currentFocusMenu?.key
                )}/${UrlUtils.generateSlug(
                  productGroup?.name,
                  productGroup?.key
                )}`}
                key={productGroup?.key}
                label={productGroup?.name || ''}
                image={productGroup?.image}
              />
            ))}
        </Space>
        {!currentFocusMenu?.productGroups?.length && (
          <div className="flex h-full w-full items-center justify-center">
            <Empty
              description={<Typography>Không có danh mục nào</Typography>}
            ></Empty>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrimaryHeaderMenuAllPopoverContent;
