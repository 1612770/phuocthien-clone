import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import PagePropsWithSeo from '@configs/types/page-props-with-seo';
import BrandModel from '@configs/models/brand.model';
import Product from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';

import getProductBrand from '@modules/brand/getProductBrand';
import ProductBrandList from '@modules/brand/ProductBrandList';

const ProductTypesPage: NextPageWithLayout<{
  productBrand: {
    productBrand: BrandModel;
    products?: WithPagination<Product[]>;
  };
}> = ({ productBrand }) => {
  return (
    <ProductBrandList
      products={productBrand?.products}
      productBrand={productBrand.productBrand}
    />
  );
};

export default ProductTypesPage;

ProductTypesPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

interface PageProps extends PagePropsWithSeo {
  productBrand: {
    productBrand: BrandModel;
    products?: WithPagination<Product[]> | [];
  };
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: PageProps;
  } = {
    props: {
      productBrand: {
        productBrand: {},
        products: [],
      },
      SEOData: {},
    },
  };

  try {
    serverSideProps.props.productBrand = await getProductBrand(context);
    serverSideProps.props.SEOData.keywordSeo =
      serverSideProps.props.productBrand.productBrand.keywordSeo;
    serverSideProps.props.SEOData.titleSeo =
      serverSideProps.props.productBrand.productBrand.titleSeo;
    serverSideProps.props.SEOData.metaSeo =
      serverSideProps.props.productBrand.productBrand.metaSeo;
  } catch (error) {
    console.error('groupInfo', error);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return serverSideProps;
};
