import Breadcrumbs from '@components/Breadcrumbs';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ProductCard from '@components/templates/ProductCard';
import PRODUCTS_LOAD_PER_TIME from '@configs/constants/products-load-per-time';
import BrandModel from '@configs/models/brand.model';
import Product from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';
import { ProductClient } from '@libs/client/Product';
import { Typography, Space, Tag, Drawer, Pagination, Empty } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Filter, X } from 'react-feather';

const ProductBrandList = ({
  products,
  productBrand,
}: {
  productBrand?: BrandModel;
  products?: WithPagination<Product[]>;
}) => {
  const [filteredByQueryProducts, setFilteredByQueryProducts] = useState<
    WithPagination<Product[]> | undefined
  >(products);

  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const router = useRouter();

  const query = router.query;

  /**
   * Refetch data when query change
   */
  useEffect(() => {
    (async () => {
      const productClient = new ProductClient(null, {});

      const productsData = await productClient.getProducts({
        page: query.trang ? Number(query.trang) : 1,
        pageSize: PRODUCTS_LOAD_PER_TIME,
        productionBrandKeys: [`${router.query.brand}`],
        sortBy: (query['sap-xep-theo'] as 'GIA_BAN_LE') || undefined,
        sortOrder: (query['sort'] as 'ASC' | 'DESC') || undefined,
      });

      setFilteredByQueryProducts(productsData.data);
    })();
  }, [query, router.query.brand]);

  return (
    <div className="px-4 pb-4 lg:container lg:px-0">
      <Breadcrumbs
        className="mb-4 pt-4 text-primary"
        breadcrumbs={[
          {
            title: 'Trang chủ',
            path: '/',
          },
          {
            title: 'Thương hiệu',
          },
          {
            title: productBrand?.name,
          },
        ]}
      ></Breadcrumbs>
      <div className="flex items-center justify-center">
        <div>
          <ImageWithFallback
            src={productBrand?.image || ''}
            alt="brand logo"
            width={128}
            height={128}
          />
        </div>
        <Typography.Title
          level={4}
          className="ml-2 mb-0 whitespace-nowrap  lg:mb-2"
        >
          Thương hiệu {productBrand?.name}
        </Typography.Title>
      </div>
      <div className="grid grid-cols-1 gap-4 ">
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
                ></Drawer>

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
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:gap-4">
              {filteredByQueryProducts?.data.map((product, index) => (
                <div className="w-full" key={index}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {!!filteredByQueryProducts?.data.length && (
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
                  total={filteredByQueryProducts?.total || 0}
                  className="mt-4"
                  current={+(router.query?.trang || 1)}
                  showSizeChanger={false}
                />
              </div>
            )}

            {!filteredByQueryProducts?.data.length && (
              <Empty
                className="mt-4 mb-8"
                description={<Typography>Không có sản phẩm nào</Typography>}
              ></Empty>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBrandList;
