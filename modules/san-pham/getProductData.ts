import { REVIEWS_LOAD_PER_TIME } from '@configs/constants/review';
import DrugStore from '@configs/models/drug-store.model';
import { FAQ } from '@configs/models/faq.model';
import OfferModel from '@configs/models/offer.model';
import Product, { InventoryAtDrugStore } from '@configs/models/product.model';
import { Review } from '@configs/models/review.model';
import { DrugstoreClient } from '@libs/client/DrugStore';
import { OfferClient } from '@libs/client/Offer';
import { ProductClient } from '@libs/client/Product';
import {
  DealPromotion,
  GiftPromotion,
  PromotionClient,
} from '@libs/client/Promotion';
import OfferUtils from '@libs/utils/offer.utils';
import { GetServerSidePropsContext } from 'next';

const getProductData = async (context: GetServerSidePropsContext) => {
  const productData: {
    product?: Product;
    otherProducts?: Product[];
    drugStoresAvailable?: InventoryAtDrugStore[];
    drugStores?: DrugStore[];
    offers?: OfferModel[];
    reviews?: Review[];
    faqs?: FAQ[];
    giftPromotions?: GiftPromotion[];
    dealPromotions?: DealPromotion[];
  } = {};

  const productClient = new ProductClient(null, {});
  const promotionClient = new PromotionClient(null, {});
  const lv2ParamSeoUrl = context.params?.lv2Param as string;
  const offerClient = new OfferClient(context, {});
  const productResponse = await productClient.getProduct({
    seoUrl: lv2ParamSeoUrl,
  });

  const product = productResponse.data;

  if (product && product.key) {
    productData.product = product;
  } else {
    throw new Error('Không tìm thấy sản phẩm');
  }

  const [
    products,
    offers,
    getReviewsResponse,
    getFAQsResponse,
    drugStoresAvailable,
    giftPromotions,
    dealPromotions,
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
    promotionClient
      .getPromotionGiftOfProduct
      // product.key
      (),
    promotionClient
      .getDealActiveOfProduct
      // product.key
      (),
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
      (product) => product.detail?.seoUrl !== lv2ParamSeoUrl
    );
  }

  if (getReviewsResponse.data) {
    productData.reviews = getReviewsResponse.data.data;
  }

  if (getFAQsResponse.data) {
    productData.faqs = getFAQsResponse.data;
  }

  if (giftPromotions.data) {
    productData.giftPromotions = giftPromotions.data;
  }

  if (dealPromotions.data) {
    productData.dealPromotions = dealPromotions.data;
  }

  return productData;
};

export default getProductData;
