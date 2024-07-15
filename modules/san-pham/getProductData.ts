import OfferModel from '@configs/models/offer.model';
import Product from '@configs/models/product.model';
import { OfferClient } from '@libs/client/Offer';
import { ProductClient } from '@libs/client/Product';
import {
  DealPromotion,
  GiftPromotion,
  PromotionClient,
} from '@libs/client/Promotion';
import OfferUtils from '@libs/utils/offer.utils';

const getProductData = async ({
  productSeoUrl,
  productTypeSeoUrl,
}: {
  productSeoUrl: string;
  productTypeSeoUrl: string;
}) => {
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

  const offerClient = new OfferClient(null, {});
  const productResponse = await productClient.getProduct({
    seoUrl: productSeoUrl,
  });
  const product = productResponse.data;
  if (productTypeSeoUrl != product?.productType?.seoUrl) {
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
      (product) => product.detail?.seoUrl !== productSeoUrl
    );
  }

  return productData;
};

export default getProductData;
