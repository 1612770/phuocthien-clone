import { Card, Col, Empty, List, Row, Skeleton, Space, Typography } from 'antd';
import { useFullMenu } from '@providers/FullMenuProvider';
import { useCallback, useEffect, useState } from 'react';
import MenuModel from '@configs/models/menu.model';
import ProductChildGroup from '@modules/products/ProductChildGroup';
import UrlUtils from '@libs/utils/url.utils';
import ProductGroupModel from '@configs/models/product-group.model';
import { ProductClient } from '@libs/client/Product';
import ProductCard from '@components/templates/ProductCard';
import PrimaryHeaderMenuAllPopoverContentLeftItem from './PrimaryHeaderMenuAllPopoverContentLeftItem';
import { useDebounce } from '@libs/utils/hooks';
import Link from 'next/link';
import Product from '@configs/models/product.model';

const generateKey = (groupKey?: string, typeKey?: string) => {
  return `${groupKey}-${typeKey}`;
};

const checkCanGetFocusGroupProducts = (
  productsMenu: {
    [key: string]: Product[];
  },
  groupKey?: string,
  typeKey?: string
) => {
  if (!groupKey || !typeKey) return false;
  const key = generateKey(groupKey, typeKey);

  return !productsMenu[key];
};

function PrimaryHeaderMenuAllPopoverContent({
  currentMenu,
  mode,
}: {
  currentMenu?: MenuModel;
  mode: 'all' | 'menu';
}) {
  const [currentFocusMenu, setCurrentFocusMenu] = useState<MenuModel>();
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [currentFocusGroup, setCurrentFocusGroup] =
    useState<ProductGroupModel>();

  const { fullMenu, setIntoPopover, setOpen, productsMenu, addProductMenu } =
    useFullMenu();
  const debouncedCurrentFocusGroup = useDebounce(currentFocusGroup, 200);

  const onGetFocusGroupProducts = useCallback(async () => {
    const canGet = checkCanGetFocusGroupProducts(
      productsMenu,
      debouncedCurrentFocusGroup?.key,
      currentMenu?.key
    );
    if (!canGet) return;

    const productClient = new ProductClient(null, {});

    setLoadingProduct(true);
    const products = await productClient.getProducts({
      page: 1,
      pageSize: 10,
      isPrescripted: false,
      productGroupKey: debouncedCurrentFocusGroup?.key,
      productTypeKey: currentMenu?.key,
    });
    setLoadingProduct(false);

    if (products.data) {
      addProductMenu(
        generateKey(debouncedCurrentFocusGroup?.key, currentMenu?.key),
        products.data.data
      );
    }
  }, [
    productsMenu,
    debouncedCurrentFocusGroup?.key,
    currentMenu?.key,
    addProductMenu,
  ]);

  /**
   * Mode: all
   * Set default current focus menu
   */
  useEffect(() => {
    if (fullMenu.length) {
      setCurrentFocusMenu(fullMenu[0]);
    }
  }, [fullMenu]);

  /**
   * Mode: menu
   * Set default current focus group
   */
  useEffect(() => {
    if (currentMenu) {
      setCurrentFocusGroup(currentMenu.productGroups?.[0]);
    }
  }, [currentMenu]);

  /**
   * Mode: menu
   * Get products when current focus group changed
   */
  useEffect(() => {
    if (debouncedCurrentFocusGroup?.key && mode === 'menu') {
      onGetFocusGroupProducts();
    }
  }, [debouncedCurrentFocusGroup, onGetFocusGroupProducts, mode]);

  const products =
    productsMenu[generateKey(currentFocusGroup?.key, currentMenu?.key)] || [];

  return (
    <div
      className="flex bg-primary-background"
      onMouseEnter={() => {
        setIntoPopover(true);
      }}
      onMouseLeave={() => {
        setIntoPopover(false);
      }}
    >
      {(mode === 'all' ||
        (mode === 'menu' && !!currentMenu?.productGroups?.length)) && (
        <div
          onClick={() => {
            setOpen(false);
            setIntoPopover(false);
          }}
        >
          <List className="max-h-[500px] min-w-[320px] overflow-auto bg-white">
            {mode === 'menu' &&
              currentMenu &&
              currentMenu.productGroups?.map((productGroup) => (
                <PrimaryHeaderMenuAllPopoverContentLeftItem
                  href={`/${UrlUtils.generateSlug(
                    currentMenu?.name,
                    currentMenu?.key
                  )}/${UrlUtils.generateSlug(
                    productGroup?.name,
                    productGroup?.key
                  )}`}
                  key={productGroup?.key}
                  active={productGroup?.key === currentFocusGroup?.key}
                  onMouseEnter={() => {
                    setCurrentFocusGroup(productGroup as ProductGroupModel);
                  }}
                  label={productGroup?.name || ''}
                  image={productGroup?.image || ''}
                />
              ))}

            {mode === 'all' &&
              fullMenu.map((menu) => (
                <PrimaryHeaderMenuAllPopoverContentLeftItem
                  href={`/${UrlUtils.generateSlug(menu?.name, menu?.key)}`}
                  key={menu?.key}
                  active={menu?.key === currentFocusMenu?.key}
                  onMouseEnter={() => {
                    setCurrentFocusMenu(menu);
                  }}
                  label={menu?.name || ''}
                  image={menu?.image || ''}
                />
              ))}
          </List>
        </div>
      )}

      <div className="max-h-[500px] w-full overflow-auto">
        {mode === 'all' && !!currentFocusMenu?.productGroups?.length && (
          <Row gutter={[12, 8]} className="p-4">
            {currentFocusMenu?.productGroups?.map((productGroup) => (
              <Col
                md={6}
                onClick={() => {
                  setOpen(false);
                  setIntoPopover(false);
                }}
                key={productGroup?.key}
              >
                <ProductChildGroup
                  href={`/${UrlUtils.generateSlug(
                    currentFocusMenu?.name,
                    currentFocusMenu?.key
                  )}/${UrlUtils.generateSlug(
                    productGroup?.name,
                    productGroup?.key
                  )}`}
                  label={productGroup?.name || ''}
                  image={productGroup?.image}
                />
              </Col>
            ))}
          </Row>
        )}

        {mode === 'menu' && (
          <div className="p-4">
            {!!currentMenu?.productGroups?.length && (
              <Space className="w-full items-center justify-between" size={20}>
                <Typography.Title level={4}>Sản phẩm nổi bật</Typography.Title>
                <div
                  onClick={() => {
                    setOpen(false);
                    setIntoPopover(false);
                  }}
                >
                  <Link
                    href={`/${UrlUtils.generateSlug(
                      currentMenu?.name,
                      currentMenu?.key
                    )}/${UrlUtils.generateSlug(
                      currentFocusGroup?.name,
                      currentFocusGroup?.key
                    )}`}
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

            {products.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {products.slice(0, 10).map((product) => (
                  <div
                    key={product.key}
                    onClick={() => {
                      setOpen(false);
                      setIntoPopover(false);
                    }}
                  >
                    <ProductCard
                      product={product}
                      className="min-w-[204px] max-w-[204px]"
                      size="small"
                    />
                  </div>
                ))}
              </div>
            )}

            {!!currentMenu?.productGroups?.length && loadingProduct && (
              <div className="flex flex-wrap gap-2">
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
        )}

        {((mode === 'all' && !currentFocusMenu?.productGroups?.length) ||
          (mode === 'menu' &&
            (!currentFocusGroup ||
              (currentFocusGroup &&
                !products.length &&
                !(
                  !!currentMenu?.productGroups?.length && loadingProduct
                ))))) && (
          <div className="flex w-full items-center justify-center py-8">
            <Empty
              description={
                <Typography>
                  Không có{' '}
                  {mode === 'menu' && currentFocusGroup && !products.length
                    ? 'sản phẩm'
                    : 'danh mục'}{' '}
                  nào
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
