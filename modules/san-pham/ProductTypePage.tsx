import Breadcrumbs from '@components/Breadcrumbs';
import ProductCard from '@components/templates/ProductCard';
import PRODUCTS_LOAD_PER_TIME from '@configs/constants/products-load-per-time';
import BrandModel from '@configs/models/brand.model';
import Product from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';
import ProductGroup from '@modules/categories/ProductGroup';
import { Drawer, Empty, Pagination, Space, Tag, Typography } from 'antd';
import { useRouter } from 'next/router';
import { Filter, X } from 'react-feather';
import FilterOptions from './FilterOptions';
import { useState } from 'react';
import { listMenu } from '@configs/constants/listMenu';

function ProductTypePage({
  productTypeSeoUrlToGetFromFullMenu,
  products,
  productBrands,
}: {
  productTypeSeoUrlToGetFromFullMenu?: string;
  productBrands?: BrandModel[];
  products?: WithPagination<Product[]>;
}) {
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const productType = (listMenu || []).find((menu) => {
    return menu.productTypeUrl === productTypeSeoUrlToGetFromFullMenu;
  });
  const router = useRouter();
  return (
    <div className="grid px-4 pb-4 lg:container lg:px-0">
      <Breadcrumbs
        className="mb-4 pt-4"
        breadcrumbs={[
          {
            title: 'Trang chủ',
            path: '/',
          },
          {
            title: productType?.productTypeName,
          },
        ]}
      ></Breadcrumbs>

      <div className="grid cursor-pointer grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6 md:gap-4 lg:grid-cols-6 xl:grid-cols-8">
        {productType?.productGroups?.map((productGroup) => (
          <>
            <ProductGroup
              key={productGroup?.productGroupUrl}
              productGroup={productGroup}
              href={`/${productType.productTypeUrl}/${productGroup?.productGroupUrl}`}
            />
          </>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(600px,_1fr)]">
        <div className="sticky top-0 hidden h-[100vh] grid-flow-row rounded-xl bg-white px-4 md:h-auto lg:block">
          <Typography.Title
            level={4}
            className="mb-0 whitespace-nowrap lg:mt-4 lg:mb-2"
          >
            Bộ lọc
          </Typography.Title>
          <FilterOptions productBrands={productBrands || []} />
        </div>
        <div>
          <div className=" lg:container lg:pl-0">
            <div className="flex flex-col justify-between lg:flex-row">
              <Typography.Title
                level={4}
                className="mb-0 whitespace-nowrap lg:mt-4 lg:mb-4"
              >
                Danh sách sản phẩm
              </Typography.Title>

              <Space wrap size={4} className="my-2">
                <Tag.CheckableTag
                  onClick={() => setOpenFilterDrawer(true)}
                  checked={false}
                  className="mr-0 inline-block rounded-full border border-solid border-gray-200 bg-white px-4 py-1 lg:hidden"
                >
                  <Filter size={12} className="mr-1 align-middle" />
                  <Typography.Text className="text-xs lg:text-sm">
                    Bộ lọc
                  </Typography.Text>
                </Tag.CheckableTag>

                <Drawer
                  open={openFilterDrawer}
                  placement="right"
                  title="Bộ lọc"
                  onClose={() => setOpenFilterDrawer(false)}
                  closable
                  closeIcon={<X size={20} />}
                >
                  <FilterOptions
                    productBrands={productBrands || []}
                    onFilterClick={() => setOpenFilterDrawer(false)}
                  />
                </Drawer>

                {[
                  {
                    label: 'Giá thấp',
                    value: 'ASC',
                    onClick: () => {
                      router.push({
                        query: {
                          ...router.query,
                          'sap-xep-theo': 'GIA_BAN_LE',
                          sort: 'ASC',
                          trang: 1,
                        },
                      });
                    },
                  },
                  {
                    label: 'Giá cao',
                    value: 'DESC',
                    onClick: () => {
                      router.push({
                        query: {
                          ...router.query,
                          'sap-xep-theo': 'GIA_BAN_LE',
                          sort: 'DESC',
                          trang: 1,
                        },
                      });
                    },
                  },
                ].map((tag) => (
                  <Tag.CheckableTag
                    key={tag.label}
                    onClick={tag.onClick}
                    checked={(router.query?.sort as string) == tag.value}
                    className={`mr-0 rounded-full border border-solid border-gray-200 bg-white px-4 py-1 ${
                      (router.query?.sort as string) == tag.value
                        ? 'bg-primary '
                        : ''
                    }`}
                  >
                    <Typography.Text
                      className={`"text-xs lg:text-sm" ${
                        (router.query?.sort as string) == tag.value
                          ? 'text-white '
                          : ''
                      }`}
                    >
                      {tag.label}
                    </Typography.Text>
                  </Tag.CheckableTag>
                ))}
              </Space>
            </div>
          </div>
          <div className="lg:container">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:gap-4">
              {products?.data.map((product, index) => (
                <div className="w-full" key={index}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {!!products?.data.length && (
              <div className="flex justify-center">
                <Pagination
                  pageSize={PRODUCTS_LOAD_PER_TIME}
                  onChange={(page) => {
                    router.replace({
                      query: {
                        ...router.query,
                        trang: page,
                      },
                    });
                  }}
                  total={products?.total || 0}
                  className="mt-4"
                  current={+(router.query?.trang || 1)}
                  showSizeChanger={false}
                />
              </div>
            )}

            {!products?.data.length && (
              <Empty
                className="mt-4 mb-8"
                description={<Typography>Không có sản phẩm nào</Typography>}
              ></Empty>
            )}
          </div>
        </div>
      </div>
      {!productType?.productGroups?.length && (
        <div className="flex min-h-[400px] w-full items-center justify-center py-8">
          <Empty
            description={<Typography>Không tìm thấy danh mục nào</Typography>}
          ></Empty>
        </div>
      )}
    </div>
  );
}

export default ProductTypePage;
