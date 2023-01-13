import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { Breadcrumb, Col, List, Row, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { ProductClient } from '@libs/client/Product';
import UrlUtils from '@libs/utils/url.utils';
import Product from '@configs/models/product.model';
import ProductCard from '@components/templates/ProductCard';
import ProductCarousel from '@modules/products/ProductCarousel';
import { MapPin, Phone } from 'react-feather';
import React, { useMemo } from 'react';
import { DrugstoreClient } from '@libs/client/DrugStore';
import DrugStore from '@configs/models/drug-store.model';
import AddToCartButton from '@modules/products/AddToCartButton';
import ProductBonusSection from '@modules/products/ProductBonusSection';

const ProductPage: NextPageWithLayout<{
  product?: Product;
  otherProducts: Product[];
  drugStores: DrugStore[];
}> = ({ product, otherProducts, drugStores }) => {
  const carouselImages: string[] = useMemo(() => {
    let memoCarouselImages: string[] = [];

    if (product?.detail?.image) {
      memoCarouselImages.push(product?.detail?.image);
    }
    if (product?.images) {
      const imageUrls = product?.images.reduce((images, currentImage) => {
        const url = currentImage?.url;
        if (url) {
          images.push(url);
        }
        return images;
      }, [] as string[]);
      memoCarouselImages = [...memoCarouselImages, ...imageUrls];
    }

    return memoCarouselImages;
  }, [product]);

  if (!product) return null;
  if (typeof product?.isDestroyed === 'boolean' && product?.isDestroyed) {
    return null;
  }
  if (typeof product?.visible === 'boolean' && !product?.visible) return null;

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
              product?.productType?.name,
              product.productType?.key
            )}`}
          >
            <a>{product.productType?.name}</a>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link
            href={`/${UrlUtils.generateSlug(
              product?.productType?.name,
              product.productType?.key
            )}/${UrlUtils.generateSlug(
              product.productGroup?.name,
              product.productGroup?.key
            )}`}
          >
            <a>{product.productGroup?.name}</a>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{product?.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 xl:grid-cols-[400px_minmax(200px,_1fr)_300px]">
        <div className="col-span-2 h-[500px] xl:sticky xl:top-[32px] xl:col-span-1">
          <ProductCarousel images={carouselImages} />
        </div>
        <div className="xl:sticky xl:top-[32px]">
          <div className="flex flex-col">
            <Typography.Title className="mx-0 mt-2 text-2xl font-bold text-primary">
              {product?.name}
            </Typography.Title>

            <ProductBonusSection />

            <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-solid border-gray-100 bg-white p-4 shadow-lg lg:gap-4">
              <div className="flex items-end">
                <Typography.Title
                  level={2}
                  className="m-0 -mb-[2px] font-bold text-primary-dark"
                >
                  {product?.retailPrice?.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Typography.Title>

                {product?.unit && (
                  <Typography.Text className="text-xl">
                    &nbsp;/&nbsp;{product?.unit}
                  </Typography.Text>
                )}
              </div>
              {product && (
                <div className="w-[140px]">
                  <AddToCartButton
                    product={product}
                    className="w-full uppercase"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mb-2 mt-8">
            {!!product?.productionBrand?.name && (
              <div className="flex items-center">
                <Typography className="my-0.5 font-medium ">
                  Thương hiệu
                </Typography>
                <Typography.Text className="ml-2">
                  {product?.productionBrand?.name}
                </Typography.Text>
              </div>
            )}

            {!!product?.ingredient && (
              <div className="flex items-center">
                <Typography className="my-0.5 font-medium ">
                  Hoạt chất
                </Typography>
                <Typography.Text className="ml-2">
                  {product?.ingredient}
                </Typography.Text>
              </div>
            )}

            {!!product?.drugContent && (
              <div className="flex items-center">
                <Typography className="my-0.5 font-medium ">
                  Hàm lượng
                </Typography>
                <Typography.Text className="ml-2">
                  {product?.drugContent}
                </Typography.Text>
              </div>
            )}

            {!!product?.packagingProcess && (
              <div className="flex items-center">
                <Typography className="my-0.5 font-medium ">
                  Quy cách đóng gói
                </Typography>
                <Typography.Text className="ml-2">
                  {product?.packagingProcess}
                </Typography.Text>
              </div>
            )}

            <div className="flex items-center">
              <Typography className="my-0.5 font-medium ">
                Là thuốc kê đơn
              </Typography>
              <Typography.Text className="ml-2">
                {product?.isPrescripted ? 'Có' : 'Không'}
              </Typography.Text>
            </div>

            {product?.isSpecial && (
              <div className="flex items-center">
                <Typography className="my-0.5 font-medium ">
                  Là thuốc đặc biệt
                </Typography>
                <Typography.Text className="ml-2">
                  {product?.isSpecial ? 'Có' : 'Không'}
                </Typography.Text>
              </div>
            )}

            {product?.isMental && (
              <div className="flex items-center">
                <Typography className="my-0.5 font-medium ">
                  Là thuốc tâm thần
                </Typography>
                <Typography.Text className="ml-2">
                  {product?.isMental ? 'Có' : 'Không'}
                </Typography.Text>
              </div>
            )}

            {!!product?.registrationNumber && (
              <div className="flex items-center">
                <Typography className="my-0.5 font-medium ">
                  Số đăng ký
                </Typography>
                <Typography.Text className="ml-2">
                  {product?.registrationNumber}
                </Typography.Text>
              </div>
            )}
          </div>
        </div>

        <div className="w-full rounded-lg border border-solid border-gray-200 p-4">
          <Typography.Title level={4} className="text-center">
            Có {drugStores.length} nhà thuốc
          </Typography.Title>
          <List>
            {drugStores.map((drugStore) => (
              <List.Item className="py-2 px-0" key={drugStore.key}>
                <div>
                  <Typography className=" font-medium">
                    {drugStore.name}
                  </Typography>
                  {drugStore.tel && (
                    <a href={`tel:${drugStore.tel}`}>
                      <Typography className="text-gray-500">
                        <Phone
                          className="mr-2 align-text-bottom text-sm"
                          size={14}
                        />
                        {drugStore.tel}
                      </Typography>
                    </a>
                  )}
                  {drugStore.address && (
                    <Typography className="text-gray-500">
                      <MapPin
                        className="mr-2  align-text-bottom text-sm"
                        size={14}
                      />
                      {drugStore.address}
                    </Typography>
                  )}
                </div>
              </List.Item>
            ))}
          </List>
        </div>
      </div>

      {product.detail?.description && (
        <div className="grid grid-cols-1">
          <div className="pl-2 lg:container lg:pl-0">
            <Typography.Title
              level={3}
              className="mb-0 mt-6 uppercase lg:mb-4 lg:mt-12"
            >
              Chi tiết sản phẩm
            </Typography.Title>
          </div>

          {product.detail?.description}
        </div>
      )}

      <div className="grid grid-cols-1">
        <div className="grid grid-cols-1">
          <div className=" lg:container lg:pl-0">
            <Typography.Title
              level={3}
              className="mb-0 mt-6 inline-block uppercase lg:mb-4 lg:mt-12"
            >
              Các sản phẩm khác{' '}
            </Typography.Title>
            <Typography.Title
              level={3}
              className="hidden uppercase lg:inline-block"
            >
              trong nhóm {product?.productGroup?.name}
            </Typography.Title>
          </div>

          {product.detail?.description}
        </div>
        {otherProducts.length > 0 && (
          <div className="lg:container">
            <Row gutter={[16, 16]} className="hidden lg:flex">
              {otherProducts.map((product, index) => (
                <Col sm={24} md={12} lg={6} className="w-full" key={index}>
                  <ProductCard
                    href={`/${UrlUtils.generateSlug(
                      product.productType?.name,
                      product.productType?.key
                    )}/${UrlUtils.generateSlug(
                      product.productGroup?.name,
                      product.productGroup?.key
                    )}/${UrlUtils.generateSlug(product?.name, product?.key)}`}
                    product={product}
                  />
                </Col>
              ))}
            </Row>
            <div className="-mx-2 flex w-full overflow-auto lg:hidden">
              {otherProducts.map((product, index) => (
                <ProductCard
                  href={`/${UrlUtils.generateSlug(
                    product.productType?.name,
                    product.productType?.key
                  )}/${UrlUtils.generateSlug(
                    product.productGroup?.name,
                    product.productGroup?.key
                  )}/${UrlUtils.generateSlug(product?.name, product?.key)}`}
                  key={index}
                  product={product}
                  className="m-2 min-w-[240px] max-w-[240px]"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
      product?: Product;
      otherProducts: Product[];
      drugStores: DrugStore[];
    };
  } = {
    props: {
      otherProducts: [],
      drugStores: [],
    },
  };

  const productClient = new ProductClient(context, {});
  const drugClient = new DrugstoreClient(context, {});
  const product = await productClient.getProduct({
    key: UrlUtils.getKeyFromParam(context.params?.product as string),
  });
  if (product.data) {
    serverSideProps.props.product = product.data;
  }

  const drugStores = await drugClient.getAllDrugStores();

  if (drugStores.data) {
    serverSideProps.props.drugStores = drugStores.data;
  }

  const products = await productClient.getProducts({
    page: 1,
    pageSize: 10,
    productTypeKey: context.params?.productTypeKey as string,
    productGroupKey: context.params?.productGroupKey as string,
    isPrescripted: false,
  });

  if (products.data) {
    serverSideProps.props.otherProducts = products.data.data.slice(0, 4);
  }

  return serverSideProps;
};

export default ProductPage;

ProductPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
