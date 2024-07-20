import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
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
import { OthersClient } from '@libs/client/Others';
import { listMenu } from '@configs/constants/listMenu';
import { GeneralClient } from '@libs/client/General';
import APIResponse from '@configs/types/api-response.type';
import { ProductTypeGroupCategory } from '@configs/models/menu.model';

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

export const getStaticPaths: GetStaticPaths = async (
  context: GetStaticPathsContext
) => {
  const generalClient = new GeneralClient(context, {});

  const productTypeGroupPromises: ReturnType<
    GeneralClient['getCategoryProduct']
  >[] = [];

  const productGroupSlugPaths = listMenu.reduce((acc, menu) => {
    if (menu.productGroups) {
      const productTypeGroupPromise = generalClient.getCategoryProduct({
        slugs: menu.productGroups.map((productGroup) => ({
          productTypeSlug: menu.productTypeUrl,
          productGroupSlug: productGroup.productGroupUrl,
        })),
        maxProductResult: 1, // TODO: reduce to 0
      });

      productTypeGroupPromises.push(productTypeGroupPromise);

      return [
        ...acc,
        ...menu.productGroups.map((productGroup) => {
          return {
            params: {
              lv1Param: menu.productTypeUrl,
              lv2Param: productGroup.productGroupUrl,
            },
          };
        }),
      ];
    }

    return acc;
  }, [] as { params: { lv1Param: string; lv2Param: string } }[]);

  const productTypeGroupSettledResponses = await Promise.allSettled(
    productTypeGroupPromises
  );
  const productTypeGroupResponses = productTypeGroupSettledResponses
    .filter((response) => response.status === 'fulfilled')
    .map((response) =>
      response.status === 'fulfilled'
        ? (response.value as APIResponse<ProductTypeGroupCategory[]>)
        : undefined
    );

  const productTypeGroupSlugPaths = productTypeGroupResponses.reduce(
    (acc, productTypeGroupResponse) => {
      if (productTypeGroupResponse?.data?.length) {
        return [
          ...acc,
          ...productTypeGroupResponse.data.reduce(
            (acc, productTypeGroupData) => {
              if (productTypeGroupData.productTypeGroup) {
                return [
                  ...acc,
                  ...productTypeGroupData.productTypeGroup.map(
                    (_productTypeGroup) => {
                      return {
                        params: {
                          lv1Param: productTypeGroupData.productTypeSeoUrl,
                          lv2Param: _productTypeGroup.seoUrl,
                        },
                      };
                    }
                  ),
                ];
              }

              return acc;
            },
            [] as { params: { lv1Param: string; lv2Param: string } }[]
          ),
        ];
      }

      return acc;
    },
    [] as { params: { lv1Param: string; lv2Param: string } }[]
  );

  const paths = [...productGroupSlugPaths, ...productTypeGroupSlugPaths];

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<LV2ParamPageProps> = async (
  context: GetStaticPropsContext
) => {
  const staticProps: ReturnType<GetStaticProps<LV2ParamPageProps>> = {
    props: {
      productTypeGroup: {},
      productGroup: {},
      product: {},
      SEOData: {},
    },
    revalidate: 3600, // 1 day
  };

  const lv1ParamSeoUrl = context.params?.lv1Param as string;
  const lv2ParamSeoUrl = context.params?.lv2Param as string;

  const othersClient = new OthersClient(context, {});

  try {
    const { data } = await othersClient.detectSlugsRelatedProduct({
      slugs: [lv1ParamSeoUrl, lv2ParamSeoUrl],
    });
    if (data?.productTypeSlugs.length) {
      if (data?.productSlugs?.length) {
        try {
          staticProps.props.product = await getProductData({
            productTypeSeoUrl: lv1ParamSeoUrl,
            productSeoUrl: lv2ParamSeoUrl,
          });

          const productDetail = staticProps.props.product.product?.detail;
          const { titleSeo, metaSeo, keywordSeo, image } = productDetail || {};
          staticProps.props.SEOData = {
            titleSeo,
            metaSeo,
            keywordSeo,
            imgSeo: image ? `https://${HOST_IMAGE}${image}` : undefined,
          };
        } catch (error) {
          return {
            notFound: true,
          };
        }
      } else if (data?.productGroupSlugs?.length) {
        try {
          staticProps.props.productGroup = await getProductGroupData({
            productTypeSeoUrl: lv1ParamSeoUrl,
            productGroupSeoUrl: lv2ParamSeoUrl,
          });
          const { productGroup } = staticProps.props;
          const { titleSeo, metaSeo, keywordSeo } =
            productGroup.productGroup || {};
          staticProps.props.SEOData = {
            titleSeo,
            metaSeo,
            keywordSeo,
          };
        } catch (error) {
          return {
            notFound: true,
          };
        }
      } else if (data?.productTypeGroupSlugs?.length) {
        try {
          staticProps.props.productTypeGroup = await getProductTypeGroupData({
            productTypeSeoUrl: lv1ParamSeoUrl,
            productTypeGroupSeoUrl: lv2ParamSeoUrl,
          });

          const { productTypeGroup } = staticProps.props;
          const { titleSeo, metaSeo, keywordSeo } =
            productTypeGroup?.productTypeGroup || {};
          staticProps.props.SEOData = {
            titleSeo,
            metaSeo,
            keywordSeo,
          };
        } catch (error) {
          return {
            notFound: true,
          };
        }
      } else {
        return {
          notFound: true,
        };
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

  return staticProps;
};
