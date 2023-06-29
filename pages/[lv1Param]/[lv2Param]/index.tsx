import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import ProductType from '@configs/models/product-type.model';
import ProductGroupModel from '@configs/models/product-group.model';
import Product, { InventoryAtDrugStore } from '@configs/models/product.model';
import BrandModel from '@configs/models/brand.model';
import WithPagination from '@configs/types/utils/with-pagination';
import DrugStore from '@configs/models/drug-store.model';
import { FAQ } from '@configs/models/faq.model';
import OfferModel from '@configs/models/offer.model';
import { Review } from '@configs/models/review.model';
import getProductGroupData from '@modules/san-pham/getProductGroupData';
import getProductData from '@modules/san-pham/getProductData';
import ProductPage from '@modules/san-pham/ProductPage';
import ProductGroupPage from '@modules/san-pham/ProductGroupPage';
import EventModel from '@configs/models/event.model';
import GroupInfoModel from '@configs/models/GroupInfoModel';
import getEventData from '@modules/san-pham/getEventData';
import EventPage from '@modules/tin-tuc/danh-muc/chi-tiet/EventPage';
import PagePropsWithSeo from '@configs/types/page-props-with-seo';

const lv2ParamPage: NextPageWithLayout<{
  productGroup: {
    productType?: ProductType;
    productGroup?: ProductGroupModel;
    productBrands?: BrandModel[];
    products?: WithPagination<Product[]>;
  };

  product: {
    product?: Product;
    otherProducts?: Product[];
    drugStoresAvailable?: InventoryAtDrugStore[];
    drugStores?: DrugStore[];
    offers?: OfferModel[];
    reviews?: Review[];
    faqs?: FAQ[];
  };

  event: {
    event?: EventModel;
    otherEvents?: EventModel[];
    groupInfo?: GroupInfoModel;
  };
}> = ({ product, productGroup, event }) => {
  if (event.event?.key) {
    return (
      <EventPage
        event={event.event}
        otherEvents={event.otherEvents}
        groupInfo={event.groupInfo}
      />
    );
  }

  if (product.product?.key) {
    return (
      <ProductPage
        product={product.product}
        otherProducts={product.otherProducts}
        drugStoresAvailable={product.drugStoresAvailable}
        drugStores={product.drugStores}
        offers={product.offers || []}
        reviews={product.reviews || []}
        faqs={product.faqs || []}
      />
    );
  }

  return (
    <ProductGroupPage
      productGroup={productGroup.productGroup}
      productType={productGroup.productType}
      productBrands={productGroup.productBrands}
      products={productGroup.products}
    />
  );
};

export default lv2ParamPage;

lv2ParamPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

interface PageProps extends PagePropsWithSeo {
  productGroup: {
    productType?: ProductType;
    productGroup?: ProductGroupModel;
    productBrands?: BrandModel[];
    products?: WithPagination<Product[]>;
  };

  product: {
    product?: Product;
    otherProducts?: Product[];
    drugStoresAvailable?: InventoryAtDrugStore[];
    drugStores?: DrugStore[];
    offers?: OfferModel[];
    reviews?: Review[];
    faqs?: FAQ[];
  };

  event: {
    event?: EventModel;
    otherEvents?: EventModel[];
    groupInfo?: GroupInfoModel;
  };
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: PageProps;
  } = {
    props: {
      productGroup: {},
      product: {},
      event: {},
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
  } catch (error) {
    try {
      serverSideProps.props.event = await getEventData(context);
      serverSideProps.props.SEOData.titleSeo =
        serverSideProps.props.event.event?.titleSeo;
      serverSideProps.props.SEOData.metaSeo =
        serverSideProps.props.event.event?.metaSeo;
      serverSideProps.props.SEOData.keywordSeo =
        serverSideProps.props.event.event?.keywordSeo;
    } catch (error) {
      try {
        serverSideProps.props.productGroup = await getProductGroupData(context);
        serverSideProps.props.SEOData.titleSeo =
          serverSideProps.props.productGroup.productGroup?.titleSeo;
        serverSideProps.props.SEOData.metaSeo =
          serverSideProps.props.productGroup.productGroup?.metaSeo;
        serverSideProps.props.SEOData.keywordSeo =
          serverSideProps.props.productGroup.productGroup?.keywordSeo;
      } catch (error) {
        // redirect to /
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }

    console.error('getProduct', error);
    return serverSideProps;
  }

  return serverSideProps;
};
