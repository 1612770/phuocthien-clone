import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { Breadcrumb, Col, Row, Space, Tag, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { GeneralClient } from '@libs/client/General';
import UrlUtils from '@libs/utils/url.utils';
import ProductType from '@configs/models/product-type.model';
import ProductGroupModel from '@configs/models/product-group.model';
import Product from '@configs/models/product.model';
import { ProductClient } from '@libs/client/Product';
import ProductCard from '@components/templates/ProductCard';
import { Fragment } from 'react';
import Link from 'next/link';

const ProductGroupPage: NextPageWithLayout<{
  productType?: ProductType;
  productGroup?: ProductGroupModel;
  products: Product[];
}> = ({ productType, productGroup, products }) => {
  return (
    <div className="container pb-4">
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

      {products?.length ? (
        <Fragment>
          <div className="pl-2 lg:container lg:pl-0">
            <div className="flex items-center justify-between">
              <Typography.Title
                level={4}
                className="mb-0 mt-4 uppercase lg:mb-4"
              >
                {productGroup?.name}
              </Typography.Title>
              <Space size={[8, 8]}>
                <Tag.CheckableTag
                  checked={false}
                  className="rounded-full border border-solid border-gray-200 px-4 py-1"
                >
                  <Typography.Text className="text-sm">
                    Bán chạy
                  </Typography.Text>
                </Tag.CheckableTag>
                <Tag.CheckableTag
                  checked={false}
                  className="rounded-full border border-solid border-gray-200 px-4 py-1"
                >
                  <Typography.Text className="text-sm">
                    Hàng mới
                  </Typography.Text>
                </Tag.CheckableTag>
                <Tag.CheckableTag
                  checked={false}
                  className="rounded-full border border-solid border-gray-200 px-4 py-1"
                >
                  <Typography.Text className="text-sm">
                    Giá thấp
                  </Typography.Text>
                </Tag.CheckableTag>
                <Tag.CheckableTag
                  checked={false}
                  className="rounded-full border border-solid border-gray-200 px-4 py-1"
                >
                  <Typography.Text className="text-sm">Giá cao</Typography.Text>
                </Tag.CheckableTag>
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
            <div className="-mx-2 flex w-full overflow-auto pl-2 lg:hidden">
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
          </div>
        </Fragment>
      ) : null}
    </div>
  );
};

export default ProductGroupPage;

ProductGroupPage.getLayout = (page) => {
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  let generalClient = new GeneralClient(null, {});

  let fullMenu = await generalClient.getMenu();
  let paths = (fullMenu.data || []).reduce(
    (
      previousPaths: {
        params: {
          productType: string;
          productGroup: string;
        };
      }[],
      menu
    ) => {
      return [
        ...previousPaths,
        ...(menu.productGroups || []).map((productGroup) => {
          return {
            params: {
              productType: UrlUtils.generateSlug(menu?.name, menu?.key),
              productGroup: UrlUtils.generateSlug(
                productGroup?.name,
                productGroup?.key
              ),
            },
          };
        }),
      ];
    },
    []
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  let staticProps: {
    props: {
      productType?: ProductType;
      productGroup?: ProductGroupModel;
      products: Product[];
    };
  } = {
    props: {
      products: [],
    },
  };

  let generalClient = new GeneralClient(null, {});
  let productClient = new ProductClient(null, {});

  let productType = await generalClient.getProductTypeDetail({
    key: UrlUtils.getKeyFromParam(String(context.params?.productType)),
  });

  staticProps.props.productType = productType.data;

  let productGroup = await generalClient.getProductGroupDetail({
    key: UrlUtils.getKeyFromParam(String(context.params?.productGroup)),
  });
  staticProps.props.productGroup = productGroup.data;

  let products = await productClient.getProducts({
    page: 1,
    pageSize: 20,
    isPrescripted: false,
    productTypeKey: productType.data?.key,
    productGroupKey: productGroup.data?.key,
  });
  staticProps.props.products = products.data.data;

  return staticProps;
};
