import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';

import PagePropsWithSeo from '@configs/types/page-props-with-seo';
import BrandModel from '@configs/models/brand.model';
import Product from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';

import getProductBrand from '@modules/brand/getProductBrand';
import ProductBrandList from '@modules/brand/ProductBrandList';
import { GeneralClient } from '@libs/client/General';

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

export const getStaticPaths: GetStaticPaths = async (
  context: GetStaticPathsContext
) => {
  const generalClient = new GeneralClient(context, {});

  const brands = await generalClient.getProductionBrands();

  const paths = (brands.data || []).map((brand) => ({
    params: { brand: brand.seoUrl },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
) => {
  const staticProps: ReturnType<GetStaticProps<PageProps>> = {
    props: {
      productBrand: {
        productBrand: {},
        products: [],
      },
      SEOData: {},
    },
    revalidate: 86400, // 1 day
  };

  const brandSeoUrl = context.params?.brand as string;

  try {
    staticProps.props.productBrand = await getProductBrand({ brandSeoUrl });

    const { productBrand } = staticProps.props;
    const { keywordSeo, titleSeo, metaSeo } = productBrand.productBrand;
    staticProps.props.SEOData = { keywordSeo, titleSeo, metaSeo };
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return staticProps;
};
