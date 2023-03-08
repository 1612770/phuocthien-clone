import PrimaryLayout from 'components/layouts/PrimaryLayout';
import {
  Breadcrumb,
  Checkbox,
  Drawer,
  Empty,
  Pagination,
  Space,
  Tag,
  Typography,
} from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { GeneralClient } from '@libs/client/General';
import UrlUtils from '@libs/utils/url.utils';
import ProductType from '@configs/models/product-type.model';
import ProductGroupModel from '@configs/models/product-group.model';
import Product from '@configs/models/product.model';
import { ProductClient } from '@libs/client/Product';
import ProductCard from '@components/templates/ProductCard';
import Link from 'next/link';
import BrandModel from '@configs/models/brand.model';
import { useRouter } from 'next/router';
import { Filter, X } from 'react-feather';
import { useState } from 'react';
import WithPagination from '@configs/types/utils/with-pagination';
import PRODUCTS_LOAD_PER_TIME from '@configs/constants/products-load-per-time';

function FilterOptions({
  productBrands,
  onFilterClick,
}: {
  productBrands: BrandModel[];
  onFilterClick?: () => void;
}) {
  const router = useRouter();
  const selectedBrands = ((router.query.brands as string) || '')
    .split(',')
    .filter((brand) => !!brand);

  return (
    <div className="py-4">
      <div className="flex gap-4">
        <Typography.Text className="font-medium">Hãng sản xuất</Typography.Text>
      </div>
      <div className="mt-2 flex flex-col">
        {productBrands.map((brand) => {
          const isActive = !!brand?.key && selectedBrands.includes(brand?.key);

          return (
            <div key={brand.key}>
              <Checkbox
                className="my-2 cursor-pointer"
                checked={isActive}
                onClick={() => {
                  onFilterClick?.();
                  if (isActive) {
                    const newBrands = selectedBrands.filter(
                      (selectedBrand) => selectedBrand !== brand.key
                    );
                    router.push({
                      query: {
                        ...router.query,
                        brands: newBrands.join(','),
                      },
                    });
                  } else {
                    router.push({
                      query: {
                        ...router.query,
                        brands: [...selectedBrands, brand.key].join(','),
                      },
                    });
                  }
                }}
              >
                {brand.name}
              </Checkbox>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ProductGroupPage: NextPageWithLayout<{
  productType?: ProductType;
  productGroup?: ProductGroupModel;
  productBrands?: BrandModel[];
  products?: WithPagination<Product[]>;
}> = ({ productType, productGroup, products, productBrands }) => {
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const router = useRouter();

  return (
    <div className="px-4 pb-4 lg:container lg:px-0">
      <Breadcrumb className="mt-4 mb-2">
        <Breadcrumb.Item>
          <Link href="/">
            <a>Trang chủ</a>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link
            href={`/${UrlUtils.generateSlug(
              productType?.name,
              productType?.key
            )}`}
          >
            <a>{productType?.name}</a>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{productGroup?.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(600px,_1fr)]">
        <div className="sticky top-0 hidden h-[100vh] grid-flow-row md:h-auto lg:block">
          <FilterOptions productBrands={productBrands || []} />
        </div>
        <div>
          <div className=" lg:container lg:pl-0">
            <div className="flex flex-col justify-between lg:flex-row">
              <Typography.Title
                level={4}
                className="mb-0 whitespace-nowrap uppercase lg:mt-4 lg:mb-4"
              >
                {productGroup?.name}
              </Typography.Title>

              <Space wrap size={4} className="my-2">
                <Tag.CheckableTag
                  onClick={() => setOpenFilterDrawer(true)}
                  checked={false}
                  className="mr-0 inline-block rounded-full border border-solid border-gray-200 px-4 py-1 lg:hidden"
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
                    onClick: () => {
                      router.push({
                        query: {
                          ...router.query,
                          'sap-xep-theo': 'GIA_BAN_LE',
                          'sap-xep': 'ASC',
                          trang: 1,
                        },
                      });
                    },
                  },
                  {
                    label: 'Giá cao',
                    onClick: () => {
                      router.push({
                        query: {
                          ...router.query,
                          'sap-xep-theo': 'GIA_BAN_LE',
                          'sap-xep': 'DESC',
                          trang: 1,
                        },
                      });
                    },
                  },
                ].map((tag) => (
                  <Tag.CheckableTag
                    key={tag.label}
                    onClick={tag.onClick}
                    checked={false}
                    className="mr-0 rounded-full border border-solid border-gray-200 px-4 py-1"
                  >
                    <Typography.Text className="text-xs lg:text-sm">
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
    </div>
  );
};

export default ProductGroupPage;

ProductGroupPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const staticProps: {
    props: {
      productType?: ProductType;
      productGroup?: ProductGroupModel;
      productBrands?: BrandModel[];
      products?: WithPagination<Product[]>;
    };
  } = {
    props: {},
  };

  const generalClient = new GeneralClient(null, {});
  const productClient = new ProductClient(null, {});

  try {
    const [productType, productGroup, productBrands] = await Promise.all([
      generalClient.getProductTypeDetail({
        key: UrlUtils.getKeyFromParam(String(context.params?.productType)),
      }),
      generalClient.getProductGroupDetail({
        key: UrlUtils.getKeyFromParam(String(context.params?.productGroup)),
      }),
      generalClient.getProductionBrands(),
    ]);

    staticProps.props.productType = productType.data;
    staticProps.props.productGroup = productGroup.data;
    staticProps.props.productBrands = productBrands.data;

    const products = await productClient.getProducts({
      page: context.query.trang ? Number(context.query.trang) : 1,
      pageSize: PRODUCTS_LOAD_PER_TIME,
      isPrescripted: false,
      productTypeKey: productType.data?.key,
      productGroupKey: productGroup.data?.key,
      productionBrandKeys: context.query.brands
        ? (context.query.brands as string).split(',')
        : undefined,
      sortBy: (context.query['sap-xep-theo'] as 'GIA_BAN_LE') || undefined,
      sortOrder: (context.query['sap-xep'] as 'ASC' | 'DESC') || undefined,
    });

    if (products.data) {
      staticProps.props.products = products.data;
    }
  } catch (error) {
    console.error(error);
  }

  return staticProps;
};
