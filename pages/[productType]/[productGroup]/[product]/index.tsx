import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';
import { GetServerSidePropsContext } from 'next';
import { ProductClient } from '@libs/client/Product';
import Product from '@configs/models/product.model';
import ProductCarousel from '@modules/products/ProductCarousel';
import React, { useMemo } from 'react';
import DrugStore from '@configs/models/drug-store.model';
import { OfferClient } from '@libs/client/Offer';
import OfferModel from '@configs/models/offer.model';
import ProductCardDetail from '@modules/products/ProductCardDetail';
import { DrugstoreClient } from '@libs/client/DrugStore';
import OfferUtils from '@libs/utils/offer.utils';
import QRApp from '@modules/products/QRApp';
import { useCacheProduct } from '@libs/utils/hooks/useCacheProduct';
import Breadcrumbs from '@components/Breadcrumbs';
import ProductOthersSection from '@modules/san-pham/chi-tiet/ProductOthersSection';
import ProductDrugStoresSection from '@modules/san-pham/chi-tiet/ProductDrugStoresSection';
import ProductMain from '@modules/san-pham/chi-tiet/ProductMain';
import { REVIEWS_LOAD_PER_TIME } from '@configs/constants/review';
import ProductCommentSection from '@modules/san-pham/chi-tiet/ProductCommentSection';
import { Review } from '@configs/models/review.model';
import ProductFAQsSection from '@modules/san-pham/chi-tiet/ProductFAQsSection';
import { FAQ } from '@configs/models/faq.model';

const ProductPage: NextPageWithLayout<{
  product?: Product;
  otherProducts?: Product[];
  drugStoresAvailable?: DrugStore[];
  drugStores?: DrugStore[];
  offers: OfferModel[];
  reviews: Review[];
  faqs: FAQ[];
}> = ({
  product,
  otherProducts,
  drugStoresAvailable,
  offers,
  drugStores,
  reviews,
  faqs,
}) => {
  useCacheProduct(product?.key);

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

  if (!product) return null;
  if (typeof product?.isDestroyed === 'boolean' && product?.isDestroyed) {
    return null;
  }
  if (typeof product?.visible === 'boolean' && !product?.visible) return null;

  return (
    <div className="px-4 pt-4 lg:container lg:px-0">
      <Breadcrumbs
        breadcrumbs={[
          {
            title: 'Trang chủ',
            path: '/',
          },
          {
            title: product?.productType?.name,
            path: `/${product?.productType?.seoUrl}`,
          },
          {
            title: product?.productGroup?.name,
            path: `/${product?.productType?.seoUrl}/${product?.productGroup?.seoUrl}`,
          },
          {
            title: product?.detail?.displayName,
          },
        ]}
      ></Breadcrumbs>

      <div className="grid grid-cols-1 gap-4 pt-2 lg:grid-cols-[minmax(200px,_1fr)_1fr] lg:gap-6 xl:grid-cols-[400px_minmax(200px,_1fr)_280px]">
        <div>
          <ProductCarousel images={carouselImages} />
          <QRApp />
        </div>

        <ProductMain offers={offers} product={product} />

        <div className="w-full lg:col-span-2 xl:col-span-1">
          <ProductDrugStoresSection
            drugStores={drugStores || []}
            drugStoresAvailable={drugStoresAvailable || []}
          />
        </div>
      </div>

      {product.detail?.description && (
        <div className="grid grid-cols-1">
          <ProductCardDetail
            dangerouslySetInnerHTML={{
              __html: product.detail?.description,
            }}
          />
        </div>
      )}

      <ProductFAQsSection faqs={faqs} />
      <ProductCommentSection product={product} defaultReviews={reviews} />

      <div className="mb-4 lg:container lg:pl-0">
        <ProductOthersSection
          name={product?.productGroup?.name || ''}
          products={otherProducts || []}
        />
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
      reviews: Review[];
      faqs: FAQ[];
    };
  } = {
    props: {
      otherProducts: [],
      drugStoresAvailable: [],
      drugStores: [],
      offers: [],
      reviews: [],
      faqs: [],
    },
  };

  const productClient = new ProductClient(context, {});
  const offerClient = new OfferClient(context, {});
  const productSeoUrl = context.params?.product as string;

  try {
    const product = await productClient.getProduct({
      seoUrl: productSeoUrl,
    });

    if (product.data && product.data.key) {
      serverSideProps.props.product = product.data;

      const [
        products,
        offers,
        getReviewsResponse,
        getFAQsResponse,
        drugStoresAvailable,
      ] = await Promise.all([
        productClient.getProducts({
          page: 1,
          pageSize: 10,
          productTypeKey: product.data.productType?.key,
          productGroupKey: product.data.productGroup?.key,
          isPrescripted: false,
        }),
        offerClient.getAllActiveOffers(),
        productClient.getReviews({
          page: 1,
          pageSize: REVIEWS_LOAD_PER_TIME,
          key: product.data.key,
        }),
        productClient.getFAQs({
          key: product.data.key,
        }),
        productClient.checkInventoryAtDrugStores({
          key: product.data.key,
        }),
      ]);

      if (drugStoresAvailable.data?.length) {
        serverSideProps.props.drugStoresAvailable =
          drugStoresAvailable.data.map((drugStore) => drugStore.drugstore);
      } else {
        const drugstoreClient = new DrugstoreClient(context, {});
        const drugStores = await drugstoreClient.getAllDrugStores();
        if (drugStores.data) {
          serverSideProps.props.drugStores = drugStores.data;
        }
      }

      if (offers.data) {
        serverSideProps.props.offers = OfferUtils.filterNonValueOffer(
          offers.data
        );
      }

      if (products.data) {
        serverSideProps.props.otherProducts = products.data.data.filter(
          (product) => product.detail?.seoUrl !== productSeoUrl
        );
      }

      if (getReviewsResponse.data) {
        serverSideProps.props.reviews = getReviewsResponse.data.data;
      }

      if (getFAQsResponse.data) {
        serverSideProps.props.faqs = getFAQsResponse.data;
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
