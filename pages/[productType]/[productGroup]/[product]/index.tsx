import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Breadcrumb, Button, Col, List, Modal, Row, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { ProductClient } from '@libs/client/Product';
import UrlUtils from '@libs/utils/url.utils';
import Product from '@configs/models/product.model';
import ProductCard from '@components/templates/ProductCard';
import ProductCarousel from '@modules/products/ProductCarousel';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import DrugStore from '@configs/models/drug-store.model';
import AddToCartButton from '@modules/products/AddToCartButton';
import ProductBonusSection from '@modules/products/ProductBonusSection';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';
import { OfferClient } from '@libs/client/Offer';
import OfferModel from '@configs/models/offer.model';

function ProductCardDetail(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [showViewMoreButton, setShowViewMoreButton] = useState(false);
  const [openFullModal, setOpenFullModal] = useState(false);

  useEffect(() => {
    setShowViewMoreButton((divRef.current?.scrollHeight || 0) > 500);
  }, [props.dangerouslySetInnerHTML?.__html]);

  return (
    <div className="relative pb-12">
      <div
        {...props}
        className=" max-h-[500px] overflow-hidden"
        ref={(ref) => {
          divRef.current = ref;
        }}
      ></div>
      {showViewMoreButton && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent">
          <div className="flex h-full w-full items-center justify-center py-4">
            <Button
              type="primary"
              ghost
              onClick={() => {
                setOpenFullModal(true);
              }}
            >
              Xem thêm
            </Button>
          </div>
        </div>
      )}

      <Modal
        title="Modal 1000px width"
        footer={null}
        style={{ top: 20, bottom: 20 }}
        open={openFullModal}
        onOk={() => setOpenFullModal(false)}
        onCancel={() => setOpenFullModal(false)}
        width={1000}
      >
        <div {...props}></div>
      </Modal>
    </div>
  );
}

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

      <div className="grid  grid-cols-1 gap-4 lg:grid-cols-[minmax(200px,_1fr)_280px] lg:gap-6 xl:grid-cols-[400px_minmax(200px,_1fr)_280px]">
        <div className="h-[500px] lg:col-span-2 xl:sticky xl:top-[32px] xl:col-span-1">
          <ProductCarousel images={carouselImages} />
        </div>

        <div className="relative xl:sticky xl:top-[32px]">
          <div className="flex flex-col">
            <Typography.Title className="mx-0 mt-2 text-2xl font-medium">
              {product?.name}
            </Typography.Title>

            <ProductBonusSection />

            <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-solid border-gray-100 bg-white p-4 shadow-lg lg:gap-4">
              <div className="flex items-end">
                <Typography.Title
                  level={2}
                  className="m-0 -mb-[2px] font-bold text-primary"
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

        <div className="w-full ">
          <div className=" rounded-lg border border-solid  border-gray-200">
            <Typography.Title
              level={5}
              className="px-4 pt-6 font-medium uppercase"
            >
              Có <b className="text-primary">{drugStores.length}</b> nhà thuốc
              có sẵn
            </Typography.Title>
            <List className="max-h-[440px] overflow-y-scroll px-4">
              {drugStores.map((drugStore) => (
                <List.Item className="py-4 px-0" key={drugStore.key}>
                  <div className="flex items-center">
                    <ImageWithFallback
                      src={drugStore.image || ''}
                      width={32}
                      height={32}
                      layout="fixed"
                      getMockImage={() =>
                        ImageUtils.getRandomMockDrugstoreUrl()
                      }
                    />
                    <div className="ml-2">
                      <Typography className=" text-xs font-medium">
                        {drugStore.name}
                      </Typography>
                      <Typography className="text-xs text-gray-600">
                        {drugStore.address}
                      </Typography>
                      <a href={`tel:${drugStore.tel}`}>
                        <Typography className="text-xs text-gray-600">
                          {drugStore.tel}
                        </Typography>
                      </a>
                    </div>
                  </div>
                </List.Item>
              ))}
            </List>
          </div>
        </div>
      </div>

      {product.detail?.description && (
        <div className="grid grid-cols-1">
          <div className="lg:container lg:pl-0">
            <Typography.Title
              level={3}
              className="mb-0 mt-6 uppercase lg:mb-4 lg:mt-12"
            >
              Chi tiết sản phẩm
            </Typography.Title>
          </div>

          <ProductCardDetail
            dangerouslySetInnerHTML={{
              __html: product.detail?.description,
            }}
          />
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
        </div>
        {otherProducts.length > 0 && (
          <div className="lg:container">
            <Row gutter={[16, 16]} className="hidden lg:flex">
              {otherProducts.map((product, index) => (
                <Col sm={24} md={12} lg={6} className="w-full" key={index}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
            <div className="-mx-2 flex w-full overflow-auto lg:hidden">
              {otherProducts.map((product, index) => (
                <ProductCard
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
      offers: OfferModel[];
    };
  } = {
    props: {
      otherProducts: [],
      drugStores: [],
      offers: [],
    },
  };

  const productClient = new ProductClient(context, {});
  const offerClient = new OfferClient(context, {});

  try {
    const product = await productClient.getProduct({
      key: UrlUtils.getKeyFromParam(context.params?.product as string),
    });

    if (product.data) {
      serverSideProps.props.product = product.data;
    }

    const drugStores = await productClient.checkInventoryAtDrugStores({
      key: UrlUtils.getKeyFromParam(context.params?.product as string),
    });

    if (drugStores.data) {
      serverSideProps.props.drugStores = drugStores.data.map(
        (drugStore) => drugStore.drugstore
      );
    }

    const [products, offers] = await Promise.all([
      productClient.getProducts({
        page: 1,
        pageSize: 10,
        productTypeKey: context.params?.productTypeKey as string,
        productGroupKey: context.params?.productGroupKey as string,
        isPrescripted: false,
      }),
      offerClient.getAllActiveOffers(),
    ]);

    if (offers.data) {
      serverSideProps.props.offers = offers.data;
    }

    if (products.data) {
      serverSideProps.props.otherProducts = products.data.data.slice(0, 4);
    }
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};

export default ProductPage;

ProductPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
