import { REVIEWS_LOAD_PER_TIME } from '@configs/constants/review';
import DrugStore from '@configs/models/drug-store.model';
import { FAQ } from '@configs/models/faq.model';
import OfferModel from '@configs/models/offer.model';
import Product, { InventoryAtDrugStore } from '@configs/models/product.model';
import { Review } from '@configs/models/review.model';
import { DrugstoreClient } from '@libs/client/DrugStore';
import { OfferClient } from '@libs/client/Offer';
import { ProductClient } from '@libs/client/Product';
import OfferUtils from '@libs/utils/offer.utils';
import { GetServerSidePropsContext } from 'next';

const getProductData = async (
  context: GetServerSidePropsContext,
  product: Product
) => {
  const productData: {
    product?: Product;
    otherProducts?: Product[];
    drugStoresAvailable?: InventoryAtDrugStore[];
    drugStores?: DrugStore[];
    offers?: OfferModel[];
    reviews?: Review[];
    faqs?: FAQ[];
  } = {};

  const productClient = new ProductClient(null, {});
  const offerClient = new OfferClient(context, {});
  const productGroupProductSeoUrl = context.params
    ?.productGroupProduct as string;

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
      productTypeKey: product.productType?.key,
      productGroupKey: product.productGroup?.key,
      isPrescripted: false,
    }),
    offerClient.getAllActiveOffers(),
    productClient.getReviews({
      page: 1,
      pageSize: REVIEWS_LOAD_PER_TIME,
      key: product.key,
    }),
    productClient.getFAQs({
      key: product.key,
    }),
    productClient.checkInventoryAtDrugStores({
      key: product.key,
    }),
  ]);

  if (drugStoresAvailable.data?.length) {
    productData.drugStoresAvailable = drugStoresAvailable.data.map(
      (drugStore) => drugStore
    );
  } else {
    const drugstoreClient = new DrugstoreClient(context, {});
    const drugStores = await drugstoreClient.getAllDrugStores();
    if (drugStores.data) {
      productData.drugStores = drugStores.data;
    }
  }

  if (offers.data) {
    productData.offers = OfferUtils.filterNonValueOffer(offers.data);
  }

  if (products.data) {
    productData.otherProducts = products.data.data.filter(
      (product) => product.detail?.seoUrl !== productGroupProductSeoUrl
    );
  }

  if (getReviewsResponse.data) {
    productData.reviews = getReviewsResponse.data.data;
  }

  if (getFAQsResponse.data) {
    productData.faqs = getFAQsResponse.data;
  }

  return productData;
};

export default getProductData;
