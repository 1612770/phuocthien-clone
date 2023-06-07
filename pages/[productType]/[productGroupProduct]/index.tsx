import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import ProductType from '@configs/models/product-type.model';
import ProductGroupModel from '@configs/models/product-group.model';
import Product, { InventoryAtDrugStore } from '@configs/models/product.model';
import { ProductClient } from '@libs/client/Product';
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

const ProductGroupProductPage: NextPageWithLayout<{
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
}> = ({ product, productGroup }) => {
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

export default ProductGroupProductPage;

ProductGroupProductPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
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
    };
  } = {
    props: {
      productGroup: {},
      product: {},
    },
  };

  const productClient = new ProductClient(null, {});
  const productGroupProductSeoUrl = context.params
    ?.productGroupProduct as string;

  try {
    const product = await productClient.getProduct({
      seoUrl: productGroupProductSeoUrl,
    });

    if (product.data && product.data.key) {
      serverSideProps.props.product.product = product.data;

      const productData = await getProductData(context, product.data);

      serverSideProps.props.product = {
        ...serverSideProps.props.product,
        ...productData,
      };
    } else {
      // redirect to /
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  } catch (error) {
    try {
      serverSideProps.props.productGroup = await getProductGroupData(context);
    } catch (error) {
      // redirect to /
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    console.error('getProduct', error);
    return serverSideProps;
  }

  return serverSideProps;
};
