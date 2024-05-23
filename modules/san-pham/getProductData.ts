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
    offers?: OfferModel[];
    giftPromotions?: GiftPromotion[];
    dealPromotions?: DealPromotion[];
    errors?: {
      code?: string;
      message?: string;
    };
  } = {};

  const productClient = new ProductClient(null, {});
  const promotionClient = new PromotionClient(null, {});
  const lv1ParamSeoUrl = context.params?.lv1Param as string;
  const lv2ParamSeoUrl = context.params?.lv2Param as string;
  const offerClient = new OfferClient(context, {});
  const productResponse = await productClient.getProduct({
    seoUrl: lv2ParamSeoUrl,
  });
  const product = productResponse.data;
  if (lv1ParamSeoUrl != product?.productType?.seoUrl) {
    throw new Error('Không tìm thấy sản phẩm');
  }
  if (product && product.key) {
    productData.product = product;
  } else {
    throw new Error('Không tìm thấy sản phẩm');
  }

  const [products, offers] = await Promise.all([
    productClient.getProducts({
      page: 1,
      pageSize: 10,
      productTypeKey: product.productType?.key,
      productGroupKey: product.productGroup?.key,
    }),
    offerClient.getAllActiveOffers(),
  ]);

  try {
    const [giftPromotions, dealPromotions] = await Promise.all([
      promotionClient.getPromotionGiftOfProduct({
        productId: product.key,
      }),
      promotionClient.getDealActiveOfProduct({
        productId: product.key,
      }),
    ]);

    if (giftPromotions.data) {
      productData.giftPromotions = giftPromotions.data;
    }

    if (dealPromotions.data) {
      productData.dealPromotions = dealPromotions.data;
    }
  } catch (error) {
    productData.giftPromotions = [];
    productData.dealPromotions = [];
  }

  if (offers.data) {
    productData.offers = OfferUtils.filterNonValueOffer(offers.data);
  }

  if (products.data) {
    productData.otherProducts = products.data.data.filter(
      (product) => product.detail?.seoUrl !== lv2ParamSeoUrl
    );
  }
  // try {
  //   const drugStoresAvailable = await productClient.checkInventoryAtDrugStores({
  //     key: product.key,
  //   });
  //   if (
  //     drugStoresAvailable.status == 'OK' &&
  //     drugStoresAvailable.data?.length
  //   ) {
  //     productData.drugStoresAvailable = drugStoresAvailable.data.map(
  //       (drugStore) => drugStore
  //     );
  //   }
  // } catch (error) {
  //   productData.drugStoresAvailable = [];
  //   productData.errors = {
  //     code: 'FAILED_LOADING_INVENTORY',
  //     message: 'Lỗi khi lấy tồn kho cho sản phẩm',
  //   };
  // }
  return productData;
};

export default getProductData;
