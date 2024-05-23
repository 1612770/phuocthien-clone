import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import ProductType from '@configs/models/product-type.model';
import ProductGroupModel from '@configs/models/product-group.model';
import Product from '@configs/models/product.model';
import BrandModel from '@configs/models/brand.model';
import WithPagination from '@configs/types/utils/with-pagination';
import OfferModel from '@configs/models/offer.model';
import getProductGroupData from '@modules/san-pham/getProductGroupData';
import getProductData from '@modules/san-pham/getProductData';
import ProductPage from '@modules/san-pham/ProductPage';
import ProductGroupPage from '@modules/san-pham/ProductGroupPage';
import PagePropsWithSeo from '@configs/types/page-props-with-seo';
import ProductTypeGroupModel from '@configs/models/product-type-group.model';
import getProductTypeGroupData from '@modules/san-pham/getProductTypeGroupData';
import ProductTypeGroupPage from '@modules/san-pham/ProductTypeGroupPage';
import { GiftPromotion, DealPromotion } from '@libs/client/Promotion';
import { HOST_IMAGE } from '@configs/env';

interface LV2ParamPageProps extends PagePropsWithSeo {
  productTypeGroup: {
    productType?: ProductType;
    productTypeGroup?: ProductTypeGroupModel;
    products?: WithPagination<Product[]>;
    productBrands?: BrandModel[];
    productGroup?: ProductGroupModel;
  };
  productGroup: {
    productType?: ProductType;
    productGroup?: ProductGroupModel;
    productBrands?: BrandModel[];
    products?: WithPagination<Product[]>;
  };

  product: {
    product?: Product;
    otherProducts?: Product[];
    offers?: OfferModel[];
    giftPromotions?: GiftPromotion[];
    dealPromotions?: DealPromotion[];
  };
}

const LV2ParamPage: NextPageWithLayout<LV2ParamPageProps> = ({
  product,
  productGroup,
  productTypeGroup,
}) => {
  if (product.product?.key) {
    return (
      <ProductPage
        product={product.product}
        otherProducts={product.otherProducts}
        offers={product.offers || []}
        giftPromotions={product.giftPromotions || []}
        dealPromotions={product.dealPromotions || []}
      />
    );
  }
  if (productGroup.productGroup?.key) {
    return (
      <ProductGroupPage
        productGroup={productGroup.productGroup}
        productType={productGroup.productType}
        productBrands={productGroup.productBrands}
        products={productGroup.products}
      />
    );
  }
  return (
    <ProductTypeGroupPage
      productTypeGroup={productTypeGroup?.productTypeGroup}
      productType={productTypeGroup?.productType}
      productBrands={productTypeGroup?.productBrands}
      productGroup={productTypeGroup?.productGroup}
      products={productTypeGroup?.products}
    />
  );
};

export default LV2ParamPage;

LV2ParamPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export const getServerSideProps: GetServerSideProps<LV2ParamPageProps> = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: LV2ParamPageProps;
  } = {
    props: {
      productTypeGroup: {},
      productGroup: {},
      product: {},
      SEOData: {},
    },
  };

  try {
    serverSideProps.props.product = await getProductData(context);
    serverSideProps.props.SEOData.titleSeo =
      serverSideProps.props.product.product?.detail?.titleSeo;
    serverSideProps.props.SEOData.metaSeo =
      serverSideProps.props.product.product?.detail?.metaSeo;
    serverSideProps.props.SEOData.keywordSeo =
      serverSideProps.props.product.product?.detail?.keywordSeo;
    serverSideProps.props.SEOData.imgSeo = `https://${HOST_IMAGE}${serverSideProps.props.product.product?.detail?.image}`;
  } catch (error) {
    console.error('getProductData', error);

    try {
      serverSideProps.props.productGroup = await getProductGroupData(context);
      serverSideProps.props.SEOData.titleSeo =
        serverSideProps.props.productGroup.productGroup?.titleSeo;
      serverSideProps.props.SEOData.metaSeo =
        serverSideProps.props.productGroup.productGroup?.metaSeo;
      serverSideProps.props.SEOData.keywordSeo =
        serverSideProps.props.productGroup.productGroup?.keywordSeo;
    } catch (error) {
      console.error('getProductGroup', error);

      try {
        serverSideProps.props.productTypeGroup = await getProductTypeGroupData(
          context
        );
        serverSideProps.props.SEOData.titleSeo =
          serverSideProps.props.productTypeGroup.productTypeGroup?.titleSeo;
        serverSideProps.props.SEOData.metaSeo =
          serverSideProps.props.productTypeGroup?.productTypeGroup?.metaSeo;
        serverSideProps.props.SEOData.keywordSeo =
          serverSideProps.props.productTypeGroup?.productTypeGroup?.keywordSeo;
      } catch (error) {
        console.error(error);
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }
    return serverSideProps;
  }

  return serverSideProps;
};
