import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import {
  Breadcrumb,
  Checkbox,
  Col,
  Drawer,
  Empty,
  Row,
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

function FilterOptions({
  productBrands,
  onFilterClick,
}: {
  productBrands: BrandModel[];
  onFilterClick?: () => void;
}) {
  const router = useRouter();
  // const selectedBrands = ((router.query.brands as string) || '')
  //   .split(',')
  //   .filter((brand) => !!brand);

  let currentBrand = router.query.brand as string;

  return (
    <div className="py-4">
      <div className="flex gap-4">
        <Typography.Text className="font-medium">Hãng sản xuất</Typography.Text>
      </div>
      <div className="mt-2 flex flex-col">
        {productBrands.map((brand) => {
          // const isActive =
          //   !!brand?.code && selectedBrands.includes(brand?.code);
          let isActive = currentBrand === brand.key;

          return (
            <div key={brand.key}>
              <Checkbox
                className="my-2 cursor-pointer"
                checked={isActive}
                // onClick={() => {
                //   if (isActive) {
                //     const newBrands = selectedBrands.filter(
                //       (selectedBrand) => selectedBrand !== brand.code
                //     );
                //     router.push({
                //       query: {
                //         ...router.query,
                //         brands: newBrands.join(','),
                //       },
                //     });
                //   } else {
                //     router.push({
                //       query: {
                //         ...router.query,
                //         brands: [...selectedBrands, brand.code].join(','),
                //       },
                //     });
                //   }
                // }}
                onClick={() => {
                  router.push({
                    query: {
                      ...router.query,
                      brand: brand.key,
                    },
                  });
                  onFilterClick?.();
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
  products: Product[];
}> = ({ productType, productGroup, products, productBrands }) => {
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);

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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(900px,_1fr)]">
        <div className="hidden grid-flow-row lg:block">
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

              <Space wrap size={4}>
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
                    label: 'Bán chạy',
                  },
                  {
                    label: 'Hàng mới',
                  },
                  {
                    label: 'Giá thấp',
                  },
                  {
                    label: 'Giá cao',
                  },
                ].map((tag) => (
                  <Tag.CheckableTag
                    key={tag.label}
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
            <Row gutter={[16, 16]} className="hidden lg:flex">
              {products.map((product, index) => (
                <Col sm={24} md={12} lg={6} className="w-full" key={index}>
                  <ProductCard
                    href={`/${UrlUtils.generateSlug(
                      product.productType?.name,
                      product.productType?.key
                    )}/${UrlUtils.generateSlug(
                      product.productGroup?.name,
                      product.productGroup?.key
                    )}/${UrlUtils.generateSlug(product.name, product.key)}`}
                    product={product}
                  />
                </Col>
              ))}
            </Row>

            <div className="-mx-4 flex w-[100vw] overflow-auto pl-2 lg:hidden">
              {products.map((product, index) => (
                <ProductCard
                  href={`/${UrlUtils.generateSlug(
                    product.productType?.name,
                    product.productType?.key
                  )}/${UrlUtils.generateSlug(
                    product.productGroup?.name,
                    product.productGroup?.key
                  )}/${UrlUtils.generateSlug(product.name, product.key)}`}
                  key={index}
                  product={product}
                  className="m-2 min-w-[240px] max-w-[240px]"
                />
              ))}
            </div>

            {!products.length && (
              <Empty
                className="mt-4"
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
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   let generalClient = new GeneralClient(null, {});

//   let fullMenu = await generalClient.getMenu();
//   let paths = (fullMenu.data || []).reduce(
//     (
//       previousPaths: {
//         params: {
//           productType: string;
//           productGroup: string;
//         };
//       }[],
//       menu
//     ) => {
//       return [
//         ...previousPaths,
//         ...(menu.productGroups || []).map((productGroup) => {
//           return {
//             params: {
//               productType: UrlUtils.generateSlug(menu?.name, menu?.key),
//               productGroup: UrlUtils.generateSlug(
//                 productGroup?.name,
//                 productGroup?.key
//               ),
//             },
//           };
//         }),
//       ];
//     },
//     []
//   );

//   return {
//     paths,
//     fallback: false,
//   };
// };

// export const getStaticProps: GetStaticProps = async (
//   context: GetStaticPropsContext
// ) => {
//   let staticProps: {
//     props: {
//       productType?: ProductType;
//       productGroup?: ProductGroupModel;
//       productBrands?: BrandModel[];
//       products: Product[];
//     };
//   } = {
//     props: {
//       products: [],
//     },
//   };

//   let generalClient = new GeneralClient(null, {});
//   let productClient = new ProductClient(null, {});

//   let [productType, productGroup, productBrands] = await Promise.all([
//     generalClient.getProductTypeDetail({
//       key: UrlUtils.getKeyFromParam(String(context.params?.productType)),
//     }),
//     generalClient.getProductGroupDetail({
//       key: UrlUtils.getKeyFromParam(String(context.params?.productGroup)),
//     }),
//     generalClient.getProductionBrands(),
//   ]);

//   staticProps.props.productType = productType.data;
//   staticProps.props.productGroup = productGroup.data;
//   staticProps.props.productBrands = productBrands.data;

//   let products = await productClient.getProducts({
//     page: 1,
//     pageSize: 20,
//     isPrescripted: false,
//     productTypeKey: productType.data?.key,
//     productGroupKey: productGroup.data?.key,
//   });
//   staticProps.props.products = products.data.data;

//   return staticProps;
// };

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let staticProps: {
    props: {
      productType?: ProductType;
      productGroup?: ProductGroupModel;
      productBrands?: BrandModel[];
      products: Product[];
    };
  } = {
    props: {
      products: [],
    },
  };

  let generalClient = new GeneralClient(null, {});
  let productClient = new ProductClient(null, {});

  let [productType, productGroup, productBrands] = await Promise.all([
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

  let products = await productClient.getProducts({
    page: 1,
    pageSize: 20,
    isPrescripted: false,
    productTypeKey: productType.data?.key,
    productGroupKey: productGroup.data?.key,
    productionBrandKey: (context.query.brand as string) || undefined,
  });

  if (products.data) {
    staticProps.props.products = products.data.data;
  }

  return staticProps;
};
