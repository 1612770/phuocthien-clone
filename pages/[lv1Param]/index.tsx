import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { GeneralClient } from '@libs/client/General';
import MenuModel from '@configs/models/menu.model';
import GroupInfoModel from '@configs/models/GroupInfoModel';
import GroupInfoPage from '@modules/tin-tuc/danh-muc/GroupInfoPage';
import ProductTypePage from '@modules/san-pham/ProductTypePage';
import PagePropsWithSeo from '@configs/types/page-props-with-seo';
import BrandModel from '@configs/models/brand.model';
import Product from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';
import { ProductClient } from '@libs/client/Product';
import PRODUCTS_LOAD_PER_TIME from '@configs/constants/products-load-per-time';
import { listMenu } from '@configs/constants/listMenu';

const ProductTypesPage: NextPageWithLayout<{
  productType: {
    productType?: MenuModel;
    productBrands?: BrandModel[];
    products?: WithPagination<Product[]>;
  };
  groupInfo: {
    groupInfo?: GroupInfoModel;
  };
}> = ({ productType, groupInfo }) => {
  if (groupInfo.groupInfo?.key) {
    return <GroupInfoPage groupInfo={groupInfo.groupInfo} />;
  }

  return (
    <ProductTypePage
      productTypeSeoUrlToGetFromFullMenu={productType.productType?.seoUrl}
      products={productType?.products}
      productBrands={productType?.productBrands}
    />
  );
};

export default ProductTypesPage;

ProductTypesPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

interface PageProps extends PagePropsWithSeo {
  groupInfo: {
    groupInfo?: GroupInfoModel;
  };
  productType: {
    productType?: MenuModel;
    productBrands?: BrandModel[];
    products?: WithPagination<Product[]>;
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const productTypePaths = listMenu.reduce((acc, menu) => {
    if (menu.productTypeUrl) {
      return [
        ...acc,
        {
          params: {
            lv1Param: menu.productTypeUrl,
          },
        },
      ];
    }

    return acc;
  }, [] as { params: { lv1Param: string } }[]);

  const paths = productTypePaths;

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
) => {
  const serverSideProps: ReturnType<GetStaticProps<PageProps>> = {
    props: {
      groupInfo: {},
      productType: {},
      SEOData: {},
    },
    revalidate: 3600, // 1 day
  };

  const lv1ParamSeoUrl = context.params?.lv1Param as string;

  const generalClient = new GeneralClient(context, {});
  const productClient = new ProductClient(null, {});

  try {
    const [productType, productBrands] = await Promise.all([
      generalClient.getProductTypeDetail({
        seoUrl: lv1ParamSeoUrl,
      }),
      generalClient.getProductionBrands(),
    ]);

    if (productType.data) {
      serverSideProps.props.productType.productType = productType.data;
      serverSideProps.props.productType.productBrands = productBrands.data;

      serverSideProps.props.SEOData = {
        titleSeo: productType.data.titleSeo,
        metaSeo: productType.data.metaSeo,
        keywordSeo: productType.data.keywordSeo,
      };

      const products = await productClient.getProducts({
        page: 1,
        pageSize: PRODUCTS_LOAD_PER_TIME,
        productTypeKey: productType.data?.key,
        isPrescripted: undefined,
        productionBrandKeys: undefined,
        sortBy: undefined,
        sortOrder: undefined,
      });

      if (products.data) {
        serverSideProps.props.productType.products = products.data;
      }
    } else {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return serverSideProps;
};
