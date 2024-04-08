import Breadcrumbs from '@components/Breadcrumbs';
import DrugStore from '@configs/models/drug-store.model';
import { FAQ } from '@configs/models/faq.model';
import OfferModel from '@configs/models/offer.model';
import Product, { InventoryAtDrugStore } from '@configs/models/product.model';
import { Review } from '@configs/models/review.model';
import { useCacheProduct } from '@libs/utils/hooks/useCacheProduct';
import ProductCardDetail from '@modules/products/ProductCardDetail';
import ProductCarousel from '@modules/products/ProductCarousel';
import { useMemo } from 'react';
import ProductCommentSection from './chi-tiet/ProductCommentSection';
import ProductFAQsSection from './chi-tiet/ProductFAQsSection';
import ProductMain from './chi-tiet/ProductMain';
import ProductOthersSection from './chi-tiet/ProductOthersSection';
import ProductMetaData from '@modules/products/ProductMetaData';
import { GiftPromotion, DealPromotion } from '@libs/client/Promotion';

const ProductPage = ({
  product,
  otherProducts,
  drugStoresAvailable,
  offers,
  drugStores,
  reviews,
  faqs,
  giftPromotions,
  dealPromotions,
  errors,
}: {
  product?: Product;
  otherProducts?: Product[];
  drugStoresAvailable?: InventoryAtDrugStore[];
  drugStores?: DrugStore[];
  offers: OfferModel[];
  reviews: Review[];
  faqs: FAQ[];
  giftPromotions: GiftPromotion[];
  dealPromotions: DealPromotion[];
  errors?: {
    code?: string;
    message?: string;
  };
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

      <div className="grid grid-cols-1 gap-4 pt-2 lg:grid-cols-[minmax(200px,_1fr)_1fr] lg:gap-6 xl:grid-cols-[600px_minmax(200px,_1fr)]">
        <div>
          <ProductCarousel images={carouselImages} />
        </div>

        <ProductMain
          offers={offers}
          product={product}
          drugStoresAvailable={drugStoresAvailable}
          errorsInventory={errors}
          drugStores={drugStores}
          giftPromotions={giftPromotions}
          dealPromotions={dealPromotions}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 pt-2 lg:grid-cols-[minmax(200px,_1fr)_1fr] lg:gap-6 xl:grid-cols-[600px_minmax(200px,_1fr)]">
        {product.detail?.description && (
          <ProductCardDetail
            dangerouslySetInnerHTML={{
              __html: product.detail?.description,
            }}
          />
        )}
        {product && <ProductMetaData product={product} />}
      </div>

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

export default ProductPage;
