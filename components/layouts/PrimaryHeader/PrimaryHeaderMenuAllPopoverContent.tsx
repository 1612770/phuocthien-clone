import { Card, Empty, List, Skeleton, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { ProductTypeGroupCategory } from '@configs/models/menu.model';
import ProductCard from '@components/templates/ProductCard';
import PrimaryHeaderMenuAllPopoverContentLeftItem from './PrimaryHeaderMenuAllPopoverContentLeftItem';
import { MenuProductGroup, MenuProductType } from '@configs/constants/listMenu';
import Link from 'next/link';
import { ListProductTypeGroup } from '@modules/san-pham/ListProductTypeGroup';
import { GeneralClient } from '@libs/client/General';
import ProductType from '@configs/models/product-type.model';

function PrimaryHeaderMenuAllPopoverContent({
  currentMenu,
  dataMenu,
}: {
  currentMenu: MenuProductType;
  dataMenu: ProductTypeGroupCategory[];
}) {
  const [currentFocusMenu, setCurrentFocusMenu] =
    useState<MenuProductType>(currentMenu);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [currentFocusGroup, setCurrentFocusGroup] = useState<MenuProductGroup>(
    currentMenu.productGroups[0]
  );

  const [loadDataMenu, setLoadDataMenu] = useState<ProductTypeGroupCategory[]>(
    []
  );

  const [productTypeGroupCategories, setProductTypeGroupCategories] = useState<
    Record<string, ProductTypeGroupCategory>[]
  >([]);

  useEffect(() => {
    if (currentMenu && dataMenu) {
      setLoadDataMenu(dataMenu);
      setCurrentFocusMenu(currentMenu);
      setCurrentFocusGroup(currentMenu.productGroups[0]);
      loadDataMenu.forEach((el) => {
        setProductTypeGroupCategories((p) => {
          if (
            p.find(
              (_el) => _el[`${el.productTypeSeoUrl}/${el.productGroupSeoUrl}`]
            )
          ) {
            return [...p];
          } else {
            return [
              ...p,
              {
                [`${el.productTypeSeoUrl}/${el.productGroupSeoUrl}`]: el,
              } as Record<string, ProductTypeGroupCategory>,
            ];
          }
        });
      });
    }
  }, [currentMenu, dataMenu, loadDataMenu]);

  useEffect(() => {
    const onMouseHoverGroup = async () => {
      const f = productTypeGroupCategories.find(
        (el) =>
          el[
            `${currentFocusMenu.productTypeUrl}/${currentFocusGroup.productGroupUrl}`
          ]
      );
      if (!f) {
        setLoadingProduct(true);
        const client = new GeneralClient(null, {});
        const res = await client.getCategoryProduct({
          slugs: [
            {
              productTypeSlug: currentFocusMenu.productTypeUrl,
              productGroupSlug: currentFocusGroup.productGroupUrl,
            },
          ],
          maxProductResult: 5,
        });
        if (res.status === 'OK' && res.data && res.data?.[0]) {
          if (!res.data[0]) {
            setLoadingProduct(false);
            return;
          }
          const record = {
            [`${res.data[0].productTypeSeoUrl}/${res.data[0].productGroupSeoUrl}`]:
              res.data[0],
          } as Record<string, ProductTypeGroupCategory>;
          setProductTypeGroupCategories((p) => [...p, record]);
        }
        setLoadingProduct(false);
      }
    };
    onMouseHoverGroup();
  }, [
    currentFocusGroup,
    currentFocusMenu.productTypeUrl,
    productTypeGroupCategories,
  ]);
  const curValue = productTypeGroupCategories.find(
    (el) =>
      el[
        `${currentFocusMenu.productTypeUrl}/${currentFocusGroup.productGroupUrl}`
      ]
  );
  const curData = curValue
    ? curValue[
        `${currentFocusMenu.productTypeUrl}/${currentFocusGroup.productGroupUrl}`
      ]
    : null;
  return (
    <div className="flex bg-gray-50">
      <div>
        <List className="max-h-[500px] min-w-[320px] overflow-auto bg-white">
          {currentMenu &&
            currentMenu.productGroups?.map((productGroup) => (
              <PrimaryHeaderMenuAllPopoverContentLeftItem
                href={`/${currentMenu.productTypeUrl}/${productGroup?.productGroupUrl}`}
                key={productGroup?.productGroupUrl}
                active={
                  productGroup?.productGroupUrl ===
                  currentFocusGroup?.productGroupUrl
                }
                onMouseEnter={() => {
                  setCurrentFocusGroup(productGroup);
                  // onMouseHoverGroup(productGroup);
                }}
                label={productGroup?.productGroupName || ''}
                image={productGroup?.productGroupImage || ''}
              />
            ))}
        </List>
      </div>

      <div className="max-h-[500px] w-full overflow-y-auto">
        <div className="p-4">
          {curData && curData.productTypeGroup && (
            <ListProductTypeGroup
              productTypeGroupData={curData.productTypeGroup}
              productType={currentMenu as ProductType}
              productTypeUrl={currentMenu.productTypeUrl}
              type="menu"
            />
          )}
          {!!currentMenu?.productGroups?.length && (
            <Space className="w-full items-center justify-between" size={20}>
              <Typography.Title level={4}>Sản phẩm nổi bật</Typography.Title>
              <div>
                <Link
                  href={`/${currentMenu.productTypeUrl}/${currentFocusGroup?.productGroupUrl}`}
                  passHref
                >
                  <a>
                    <Typography className="pr-3 text-blue-500">
                      Xem tất cả
                    </Typography>
                  </a>
                </Link>
              </div>
            </Space>
          )}

          {curData && curData.products && curData.products.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {curData.products.map((product) => (
                <div key={product.key}>
                  <ProductCard
                    product={product}
                    className="min-w-[204px] max-w-[204px]"
                    size="small"
                  />
                </div>
              ))}
            </div>
          )}

          {!curData && loadingProduct && (
            <div className="flex gap-2 overflow-x-auto">
              <Card
                cover={
                  <div className="relative h-[168px] w-full bg-gray-100 transition-transform duration-300 group-hover:scale-110">
                    <Skeleton.Image className="h-full w-full" />
                  </div>
                }
                bodyStyle={{
                  padding: '12px',
                }}
                className={`relative min-w-[204px] max-w-[204px] overflow-hidden transition duration-300 group-hover:border-primary-light`}
              >
                <Skeleton.Button active shape="square" />
                <Skeleton.Input active block className="mt-1" />
                <Skeleton.Button active shape="square" className="mt-2" />
              </Card>
              <Card
                cover={
                  <div className="relative h-[168px] w-full bg-gray-100 transition-transform duration-300 group-hover:scale-110">
                    <Skeleton.Image className="h-full w-full" />
                  </div>
                }
                bodyStyle={{
                  padding: '12px',
                }}
                className={`relative min-w-[204px] max-w-[204px] overflow-hidden transition duration-300 group-hover:border-primary-light`}
              >
                <Skeleton.Button active shape="square" />
                <Skeleton.Input active block className="mt-1" />
                <Skeleton.Button active shape="square" className="mt-2" />
              </Card>
              <Card
                cover={
                  <div className="relative h-[168px] w-full bg-gray-100 transition-transform duration-300 group-hover:scale-110">
                    <Skeleton.Image className="h-full w-full" />
                  </div>
                }
                bodyStyle={{
                  padding: '12px',
                }}
                className={`relative min-w-[204px] max-w-[204px] overflow-hidden transition duration-300 group-hover:border-primary-light`}
              >
                <Skeleton.Button active shape="square" />
                <Skeleton.Input active block className="mt-1" />
                <Skeleton.Button active shape="square" className="mt-2" />
              </Card>
              <Card
                cover={
                  <div className="relative h-[168px] w-full bg-gray-100 transition-transform duration-300 group-hover:scale-110">
                    <Skeleton.Image className="h-full w-full" />
                  </div>
                }
                bodyStyle={{
                  padding: '12px',
                }}
                className={`relative min-w-[204px] max-w-[204px] overflow-hidden transition duration-300 group-hover:border-primary-light`}
              >
                <Skeleton.Button active shape="square" />
                <Skeleton.Input active block className="mt-1" />
                <Skeleton.Button active shape="square" className="mt-2" />
              </Card>
            </div>
          )}
        </div>

        {!curData && (
          <div className="flex w-full items-center justify-center py-8">
            <Empty
              description={
                <Typography>
                  Không có {currentFocusGroup ? 'sản phẩm' : 'danh mục'} nào
                </Typography>
              }
            ></Empty>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrimaryHeaderMenuAllPopoverContent;
