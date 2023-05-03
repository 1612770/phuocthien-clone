import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Breadcrumb, Col, Empty, List, Row, Tag, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { ProductClient } from '@libs/client/Product';
import UrlUtils from '@libs/utils/url.utils';
import Product from '@configs/models/product.model';
import ProductCard from '@components/templates/ProductCard';
import ProductCarousel from '@modules/products/ProductCarousel';
import React, { useMemo } from 'react';
import DrugStore from '@configs/models/drug-store.model';
import AddToCartButton from '@modules/products/AddToCartButton';
import ProductBonusSection from '@modules/products/ProductBonusSection';
import { OfferClient } from '@libs/client/Offer';
import OfferModel from '@configs/models/offer.model';
import ProductCardDetail from '@modules/products/ProductCardDetail';
import { DrugstoreClient } from '@libs/client/DrugStore';
import DrugstoreItem from '@modules/drugstore/DrugstoreItem';
import COLORS from '@configs/colors';
import OfferUtils from '@libs/utils/offer.utils';
import QRApp from '@modules/products/QRApp';
import PromotionList from '@modules/products/PromotionList';
import PriceUnit from '@modules/products/PriceUnit';
import { PromotionPercent } from '@configs/models/promotion.model';
import { useCart } from '@providers/CartProvider';
import { InfoCircleOutlined } from '@ant-design/icons';
import ProductMetaData from '@modules/products/ProductMetaData';

const getMaxDiscount = (promotionPercents: PromotionPercent[]): number => {
  let maxDiscount = 0;
  promotionPercents.forEach((promotion) => {
    if (promotion.val > maxDiscount) {
      maxDiscount = promotion.val;
    }
  });
  return maxDiscount;
};

const getNextPromotion = (
  promotionPercents: PromotionPercent[],
  currentQuantity: number
): PromotionPercent | undefined => {
  let nextPromo: PromotionPercent | undefined = undefined;

  promotionPercents.forEach((promotion) => {
    if (promotion.productQuantityMinCondition > currentQuantity) {
      nextPromo = promotion;
    }
  });

  return nextPromo;
};

const getInstruction = (
  promotionPercents: PromotionPercent[],
  currentQuantity: number
): string => {
  const nextPromo = getNextPromotion(promotionPercents, currentQuantity);

  if (!nextPromo) return '';
  return `Mua ${currentQuantity ? 'thêm' : 'ít nhất'} ${
    nextPromo.productQuantityMinCondition - currentQuantity
  } sản phẩm để được giảm ${nextPromo.val * 100}%`;
};

const ProductPage: NextPageWithLayout<{
  product?: Product;
  otherProducts?: Product[];
  drugStoresAvailable?: DrugStore[];
  drugStores?: DrugStore[];
  offers: OfferModel[];
}> = ({ product, otherProducts, drugStoresAvailable, offers, drugStores }) => {
  const { cartProducts } = useCart();

  const carouselImages: string[] = useMemo(() => {
    let memoCarouselImages: string[] = [];

    if (product?.detail?.image) {
      memoCarouselImages.push(product?.detail?.image);
    }

    if (product?.images) {
      const imageUrls = product?.images.reduce((images, currentImage) => {
        const url = currentImage?.image;
        if (url) {
          images.push(url);
        }
        return images;
      }, [] as string[]);
      memoCarouselImages = [...memoCarouselImages, ...imageUrls];
    }

    return memoCarouselImages;
  }, [product]);

  const curProductIncart = cartProducts.find(
    (item) => item.product.key === product?.key
  );
  const maxDisCount = getMaxDiscount(product?.promotions || []);
  const nextInstruction = getInstruction(
    product?.promotions || [],
    curProductIncart?.quantity || 0
  );

  const drugstoresToShow =
    (drugStoresAvailable?.length || 0) > 0 ? drugStoresAvailable : drugStores;

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
            href={`/san-pham/${UrlUtils.generateSlug(
              product?.productType?.name,
              product.productType?.key
            )}`}
          >
            <a>{product.productType?.name}</a>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link
            href={`/san-pham/${UrlUtils.generateSlug(
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
        <Breadcrumb.Item>{product?.detail?.displayName}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="grid  grid-cols-1 gap-4 lg:grid-cols-[minmax(200px,_1fr)_1fr] lg:gap-6 xl:grid-cols-[400px_minmax(200px,_1fr)_280px]">
        <div>
          <div className=" mb-4 lg:col-span-2 lg:pt-4 xl:col-span-1">
            <ProductCarousel images={carouselImages} />
          </div>
          <QRApp />
        </div>

        <div className="relative ">
          <div className="flex flex-col">
            <Typography.Title className="mx-0 mt-2 text-2xl font-medium">
              {product?.detail?.displayName}
            </Typography.Title>

            <ProductBonusSection offers={offers} />

            <div className="relative flex w-full flex-col flex-wrap gap-2 rounded-lg border border-solid border-gray-100 bg-white p-4 shadow-lg md:flex-nowrap lg:gap-2">
              {maxDisCount > 0 && (
                <Tag
                  color={COLORS.red}
                  className="absolute -top-[8px] -left-[8px]"
                >
                  Giảm {maxDisCount * 100}%
                </Tag>
              )}

              {nextInstruction && (
                <div className="flex items-center gap-2 text-blue-500">
                  <InfoCircleOutlined size={12} />
                  <Typography.Text className="text-inherit">
                    {nextInstruction}
                  </Typography.Text>
                </div>
              )}

              <div className="flex w-full flex-1 flex-wrap items-start justify-between">
                <PriceUnit
                  price={product.retailPrice}
                  discountVal={maxDisCount}
                  unit={product.unit}
                />
                {product && (
                  <div className="w-full md:w-[140px]">
                    <AddToCartButton
                      product={product}
                      className="w-full uppercase"
                    />
                  </div>
                )}
              </div>
              {!!product.promotions?.length && (
                <PromotionList
                  promotionPercents={product.promotions || []}
                  retailPrice={product.retailPrice}
                />
              )}
            </div>
          </div>

          {product && <ProductMetaData product={product} />}
        </div>

        <div className="w-full lg:col-span-2 xl:col-span-1">
          <div className=" rounded-lg border border-solid  border-gray-200">
            <Typography.Title
              level={5}
              className="px-4 pt-6 font-medium uppercase"
            >
              {(drugStoresAvailable?.length || 0) > 0 ? (
                <>
                  Có{' '}
                  <b className="text-primary">{drugStoresAvailable?.length}</b>{' '}
                  nhà thuốc có sẵn
                </>
              ) : (
                <>Hệ thống nhà thuốc Phước Thiện</>
              )}
            </Typography.Title>
            <List className="max-h-[440px] overflow-y-scroll px-0">
              {drugstoresToShow?.map((drugStore) => (
                <DrugstoreItem drugstore={drugStore} key={drugStore.key} />
              ))}

              {!drugstoresToShow?.length && (
                <Empty
                  className="my-8"
                  description={<Typography>Không có nhà thuốc nào</Typography>}
                ></Empty>
              )}
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
              Các sản phẩm cùng loại
            </Typography.Title>{' '}
            <Typography.Title
              level={3}
              className="hidden uppercase lg:inline-block"
            >
              trong nhóm {product?.productGroup?.name}
            </Typography.Title>
          </div>
        </div>

        {(otherProducts?.length || 0) > 0 && (
          <div className="lg:container">
            <Row gutter={[16, 16]} className="hidden lg:flex">
              {otherProducts?.map((product, index) => (
                <Col sm={24} md={12} lg={6} className="w-full" key={index}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
            <div className="-mx-2 flex w-full overflow-auto lg:hidden">
              {otherProducts?.map((product, index) => (
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
      drugStoresAvailable: DrugStore[];
      drugStores: DrugStore[];
      offers: OfferModel[];
    };
  } = {
    props: {
      otherProducts: [],
      drugStoresAvailable: [],
      drugStores: [],
      offers: [],
    },
  };

  const productClient = new ProductClient(context, {});
  const offerClient = new OfferClient(context, {});
  const productKey = UrlUtils.getKeyFromParam(
    context.params?.product as string
  );

  try {
    const product = await productClient.getProduct({
      key: productKey,
    });

    if (product.data) {
      serverSideProps.props.product = product.data;

      const [products, offers] = await Promise.all([
        productClient.getProducts({
          page: 1,
          pageSize: 10,
          productTypeKey: product.data.productType?.key,
          productGroupKey: product.data.productGroup?.key,
          isPrescripted: false,
        }),
        offerClient.getAllActiveOffers(),
      ]);

      if (offers.data) {
        serverSideProps.props.offers = OfferUtils.filterNonValueOffer(
          offers.data
        );
      }

      if (products.data) {
        serverSideProps.props.otherProducts = products.data.data
          .filter((product) => product.key !== productKey)
          .slice(0, 4);
      }
    }

    const drugStoresAvailable = await productClient.checkInventoryAtDrugStores({
      key: productKey,
    });

    if (drugStoresAvailable.data?.length) {
      serverSideProps.props.drugStoresAvailable = drugStoresAvailable.data.map(
        (drugStore) => drugStore.drugstore
      );
    } else {
      const drugstoreClient = new DrugstoreClient(context, {});
      const drugStores = await drugstoreClient.getAllDrugStores();
      if (drugStores.data) {
        serverSideProps.props.drugStores = drugStores.data;
      }
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
