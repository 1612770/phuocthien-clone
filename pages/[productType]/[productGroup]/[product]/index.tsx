import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Typography,
} from 'antd';
import { NextPageWithLayout } from 'pages/page';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { ProductClient } from '@libs/client/Product';
import UrlUtils from '@libs/utils/url.utils';
import Product from '@configs/models/product.model';
import ProductCard from '@components/templates/ProductCard';
import ProductCarousel from '@modules/products/ProductCarousel';
import { Minus, Plus } from 'react-feather';
import React, { useMemo, useState } from 'react';
import { useCart } from '@providers/CartProvider';

const ProductPage: NextPageWithLayout<{
  product?: Product;
  otherProducts: Product[];
}> = ({ product, otherProducts }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  let carouselImages: string[] = useMemo(() => {
    let memoCarouselImages: string[] = [];

    if (product?.detail?.image) {
      memoCarouselImages.push(product?.detail?.image);
    }
    if (product?.images) {
      let imageUrls = product?.images.reduce((images, currentImage) => {
        let url = currentImage?.url;
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
    <div className="px-4 pb-4 lg:container">
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <div className="h-[500px]">
          <ProductCarousel images={carouselImages} />
        </div>
        <div>
          <div className="flex flex-col">
            {product?.productionBrand?.name && (
              <Typography>
                Thương hiệu: {product?.productionBrand?.name}
              </Typography>
            )}
            <Typography.Title className="my-2 mx-0 text-2xl font-bold text-primary">
              {product?.name}
            </Typography.Title>

            <div>
              <Typography>Số lượng:</Typography>
              <Input.Group className="max-w-[160px]" compact>
                <Button
                  icon={<Minus size={20} />}
                  onClick={() => {
                    if (quantity > 1) {
                      setQuantity(quantity - 1);
                    }
                  }}
                />
                <Input
                  className="max-w-[40px]"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(+e.target.value);
                  }}
                />
                <Button
                  icon={<Plus size={20} />}
                  onClick={() => {
                    setQuantity(quantity + 1);
                  }}
                />
              </Input.Group>
            </div>

            <Space className="mt-4 w-full gap-2 lg:gap-4" wrap>
              <Button
                className="px:4 h-[40px] w-full shadow-none lg:h-[60px] lg:px-10"
                shape="round"
                type="primary"
                onClick={() => {
                  addToCart({ product, quantity });
                }}
              >
                <Typography className="font-semibold uppercase text-white">
                  Thêm vào giỏ hàng
                </Typography>
              </Button>
              <Button
                className="h-[40px] bg-orange-500 shadow-none lg:h-[60px]"
                shape="round"
                type="primary"
              >
                <Typography className="font-semibold uppercase text-white">
                  Tìm nhà thuốc
                </Typography>
              </Button>
            </Space>

            <Divider />
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
          </div>

          <div className="my-2">
            {!!product?.ingredient && (
              <div className="flex items-center">
                <Typography className="my-0.5 min-w-[160px] font-semibold">
                  Hoạt chất
                </Typography>
                <Typography.Text className="ml-2">
                  {product?.ingredient}
                </Typography.Text>
              </div>
            )}

            {!!product?.drugContent && (
              <div className="flex items-center">
                <Typography className="my-0.5 min-w-[160px] font-semibold">
                  Hàm lượng
                </Typography>
                <Typography.Text className="ml-2">
                  {product?.drugContent}
                </Typography.Text>
              </div>
            )}

            {!!product?.packagingProcess && (
              <div className="flex items-center">
                <Typography className="my-0.5 min-w-[160px] font-semibold">
                  Quy cách đóng gói
                </Typography>
                <Typography.Text className="ml-2">
                  {product?.packagingProcess}
                </Typography.Text>
              </div>
            )}

            <div className="flex items-center">
              <Typography className="my-0.5 min-w-[160px] font-semibold">
                Là thuốc kê đơn
              </Typography>
              <Typography.Text className="ml-2">
                {product?.isPrescripted ? 'Có' : 'Không'}
              </Typography.Text>
            </div>

            {product?.isSpecial && (
              <div className="flex items-center">
                <Typography className="my-0.5 min-w-[160px] font-semibold">
                  Là thuốc đặc biệt
                </Typography>
                <Typography.Text className="ml-2">
                  {product?.isSpecial ? 'Có' : 'Không'}
                </Typography.Text>
              </div>
            )}

            {product?.isMental && (
              <div className="flex items-center">
                <Typography className="my-0.5 min-w-[160px] font-semibold">
                  Là thuốc tâm thần
                </Typography>
                <Typography.Text className="ml-2">
                  {product?.isMental ? 'Có' : 'Không'}
                </Typography.Text>
              </div>
            )}

            {!!product?.registrationNumber && (
              <div className="flex items-center">
                <Typography className="my-0.5 min-w-[160px] font-semibold">
                  Số đăng ký
                </Typography>
                <Typography.Text className="ml-2">
                  {product?.registrationNumber}
                </Typography.Text>
              </div>
            )}
          </div>
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
  let serverSideProps: {
    props: {
      product?: Product;
      otherProducts: Product[];
    };
  } = {
    props: {
      otherProducts: [],
    },
  };

  let productClient = new ProductClient(context, {});
  let product = await productClient.getProduct({
    key: UrlUtils.getKeyFromParam(context.params?.product as string),
  });
  if (product.data) {
    serverSideProps.props.product = product.data;
  }

  let products = await productClient.getProducts({
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
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};
