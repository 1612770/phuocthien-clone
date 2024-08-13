import VIRAL_PRODUCTS_LOAD_PER_TIME from '@configs/constants/viral-products-load-per-time';
import { BANNER_ENABLED } from '@configs/env';
import BrandModel from '@configs/models/brand.model';
import { Article, Category } from '@configs/models/cms.model';
import ProductSearchKeyword from '@configs/models/product-search-keyword.model';
import Product from '@configs/models/product.model';
import { Campaign, Promotion } from '@configs/models/promotion.model';
import SlideBannerModel from '@configs/models/slide-banner.model';
import ViralProductsListModel from '@configs/models/viral-products-list.model';
import PagePropsWithSeo from '@configs/types/page-props-with-seo';
import { CmsClient } from '@libs/client/Cms';
import { GeneralClient } from '@libs/client/General';
import { ProductClient } from '@libs/client/Product';
import { PromotionClient } from '@libs/client/Promotion';
import { getVisibleItems } from '@libs/helpers';
import { useAppData } from '@providers/AppDataProvider';
import { Col, Grid, Row } from 'antd';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect } from 'react';
import { NextPageWithLayout } from './page';

import HomepageBrands from '@modules/homepage/HomepageBrands';
import HomepageCarousel from '@modules/homepage/HomepageCarousel';
import HomepageSearchSection from '@modules/homepage/HomepageSearchSection';
import HomeUtils from '@modules/homepage/HomeUtils';
import MainInfoSection from '@modules/homepage/MainInfoSection';
import ViralProductsList from '@modules/products/ViralProductsList';
import PrimaryLayout from '@components/layouts/PrimaryLayout';
const LinkWrapper = dynamic(
  () => import('../components/templates/LinkWrapper'),
  {
    ssr: false,
  }
);
// const HomeUtils = dynamic(() => import('../modules/homepage/HomeUtils'), {
//   ssr: false,
// });
// const ViralProductsList = dynamic(
//   () => import('../modules/products/ViralProductsList'),
//   {
//     ssr: false,
//   }
// );

const { useBreakpoint } = Grid;

interface HomeProps extends PagePropsWithSeo {
  viralProductsLists?: ViralProductsListModel[];
  slideBanner?: SlideBannerModel[];
  productSearchKeywords?: ProductSearchKeyword[];
  campaigns?: Campaign[];
  listProducts?: Product[][];
  brands: BrandModel[];
  promotions: Promotion[];
  categories: Category[];
  articles: Article[];
}

const Home: NextPageWithLayout<HomeProps> = ({
  viralProductsLists,
  slideBanner,
  productSearchKeywords,
  campaigns,
  brands,
  promotions,
  articles,
  categories,
}) => {
  const { setProductSearchKeywords } = useAppData();
  const percentPromotionSliderImages =
    campaigns?.map((campaign) => {
      let link;
      if (campaign.promotions.length > 0) {
        link = '/khuyen-mai/' + (campaign.slug || campaign.key);
      }

      return {
        url: campaign.imgUrl,
        link,
      };
    }) || [];

  const promotionsSliderImages = promotions.reduce((acc, promotion) => {
    let link;
    if (promotion.type === 'COMBO') {
      link = '/khuyen-mai/combo/' + promotion.slug;
      acc.push({
        url: promotion.imageUrl,
        link,
      });
    }

    return acc;
  }, [] as { url: string; link?: string }[]);

  const promotionSliderImages = [
    ...promotionsSliderImages,
    ...percentPromotionSliderImages,
  ];
  const bannerVisibleSlides =
    BANNER_ENABLED || promotionSliderImages.length === 0
      ? getVisibleItems(slideBanner || []).map((slide) => ({
          url: (slide.imageUrl as string) || '',
        }))
      : [];

  useEffect(() => {
    setProductSearchKeywords(productSearchKeywords || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const screens = useBreakpoint();

  return (
    <section className="mb-0 lg:mb-4">
      <section id="banner">
        <div className="container overflow-hidden">
          <div
            className={`px-0 ${
              promotionSliderImages.length && screens.md ? `container` : ''
            }`}
          >
            <div className="px-2 md:px-0 lg:mt-4">
              <Row gutter={[8, 16]}>
                <Col
                  lg={{ span: 16 }}
                  md={{ span: 24 }}
                  xs={{ span: 24 }}
                  className="relative"
                >
                  {!!promotionSliderImages.length && (
                    <HomepageCarousel
                      sliderImages={promotionSliderImages}
                      numberSlidePerPage={1}
                      type="primary"
                    />
                  )}

                  {!!bannerVisibleSlides?.length && (
                    <div
                      className={`${
                        promotionSliderImages.length && screens.md ? `mt-4` : ''
                      }`}
                    >
                      <HomepageCarousel
                        sliderImages={bannerVisibleSlides}
                        numberSlidePerPage={
                          promotionSliderImages.length &&
                          (screens.md || screens.xs)
                            ? 2
                            : 1
                        }
                        type={
                          promotionSliderImages.length ? 'secondary' : 'primary'
                        }
                      />
                    </div>
                  )}
                </Col>
                <Col
                  lg={{ span: 8 }}
                  md={{ span: 24 }}
                  xs={{ span: 24 }}
                  className="hidden w-full md:block"
                >
                  <Row gutter={[16, 8]} className="h-full">
                    <Col xs={24} sm={12} lg={24}>
                      <LinkWrapper
                        href="#"
                        className="relative flex w-full flex-col"
                      >
                        <div className="aspect-[300/98]">
                          <Image
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgwVjB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+"
                            src={`https://pt-storage-prd.hn.ss.bfcplatform.vn/tag2.jpg`}
                            alt="carousel image"
                            layout="fill"
                            placeholder="blur"
                            objectFit={'fill'}
                            className="rounded-xl"
                            objectPosition="center"
                          />
                        </div>
                      </LinkWrapper>
                    </Col>
                    <Col xs={24} sm={12} lg={24}>
                      <LinkWrapper
                        href={`/chinh-sach-doi-tra`}
                        className="relative flex w-full flex-col"
                      >
                        <div className="aspect-[300/98]">
                          <Image
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgwVjB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+"
                            src={`https://pt-storage-prd.hn.ss.bfcplatform.vn/tag1.jpg`}
                            alt="carousel image"
                            layout="fill"
                            placeholder="blur"
                            objectFit={'fill'}
                            className="rounded-xl"
                            objectPosition="center"
                          />
                        </div>
                      </LinkWrapper>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <HomeUtils />
              </Row>
            </div>
          </div>
        </div>
      </section>
      {!promotionSliderImages?.length && (
        <div
          className={`mb-[32px] hidden lg:block ${
            !!promotionSliderImages.length || !!bannerVisibleSlides.length
              ? '-mt-[100px]'
              : 'mt-[32px]'
          }`}
        >
          <HomepageSearchSection />
        </div>
      )}

      {viralProductsLists &&
        viralProductsLists.length > 0 &&
        viralProductsLists?.map((viralProductsList, index) => (
          <section
            id={'virals_' + viralProductsList.seoUrl}
            key={viralProductsList.key}
          >
            <ViralProductsList
              key={viralProductsList.key}
              viralProductsList={viralProductsList}
              invertBackground={
                index % 2 === 1 && index !== viralProductsLists.length - 1
              }
            />
          </section>
        ))}
      {brands?.length > 0 && (
        <section id="brands">
          <div className="relative">
            <HomepageBrands brands={brands} />
          </div>
        </section>
      )}
      <section id="blog">
        <MainInfoSection articles={articles} categories={categories} />
      </section>
    </section>
  );
};

export default Home;

Home.getLayout = (page) => {
  const showSearch = !!page.props.campaigns?.length;
  return <PrimaryLayout showSearch={showSearch}>{page}</PrimaryLayout>;
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const staticProps: ReturnType<GetStaticProps<HomeProps>> = {
    props: {
      viralProductsLists: [],
      slideBanner: [],
      productSearchKeywords: [],
      campaigns: [],
      listProducts: [],
      brands: [],
      promotions: [],
      categories: [],
      articles: [],
      SEOData: {},
    },
    revalidate: 1800, // 30 mins
  };

  staticProps.props.SEOData.titleSeo =
    'Nhà thuốc Phước Thiện - Nhà thuốc của người Đà Nẵng';
  staticProps.props.SEOData.keywordSeo =
    'Nhà thuốc Phước Thiện, nhà thuốc, Phước Thiện, nhà thuốc Đà Nẵng';
  staticProps.props.SEOData.metaSeo =
    'Nhà thuốc Phước Thiện là chuỗi nhà thuốc lớn - uy tín số 1, chuyên thuốc theo đơn Bác sĩ , dược mỹ phẩm , thực phẩm bảo vệ sức khoẻ, thiết bị y tế, chăm sóc cá nhân.';

  const productClient = new ProductClient(context, {});
  const generalClient = new GeneralClient(context, {});
  const promotionClient = new PromotionClient(context, {});
  const cmsClient = new CmsClient(context, {});

  try {
    const [
      viralProducts,
      slideBanner,
      productSearchKeywords,
      campaigns,
      brands,
      promotions,
      articles,
      categories,
    ] = await Promise.allSettled([
      productClient.getViralProducts({
        page: 1,
        pageSize: VIRAL_PRODUCTS_LOAD_PER_TIME,
      }),
      generalClient.getSlideBanner(),
      generalClient.getProductSearchKeywords(),

      promotionClient.getPromo({
        page: 1,
        pageSize: 20,
        isHide: false,
      }),
      generalClient.getProductionBrands(),
      promotionClient.getPromotion({
        isHide: false,
      }),
      cmsClient.getArticles({ q: { type: 'BLOG' }, limit: 5, offset: 0 }),
      cmsClient.getCMSCategories({
        offset: 0,
        q: { type: 'BLOG', loadLevel: 1 },
        limit: 10,
      }),
    ]);

    if (viralProducts.status === 'fulfilled' && viralProducts.value.data) {
      staticProps.props.viralProductsLists = viralProducts.value.data || [];
    }

    if (slideBanner.status === 'fulfilled' && slideBanner.value.data) {
      staticProps.props.slideBanner = slideBanner.value.data || [];
    }
    if (brands.status === 'fulfilled' && brands.value.data) {
      staticProps.props.brands = brands.value.data || [];
    }

    if (categories.status === 'fulfilled' && categories.value.data) {
      staticProps.props.categories = categories.value.data || [];
    }

    if (articles.status === 'fulfilled' && articles.value.data) {
      staticProps.props.articles = articles.value.data || [];
    }

    if (
      productSearchKeywords.status === 'fulfilled' &&
      productSearchKeywords.value.data
    ) {
      staticProps.props.productSearchKeywords =
        productSearchKeywords.value.data || [];
    }

    if (campaigns.status === 'fulfilled' && campaigns.value.data) {
      staticProps.props.campaigns = campaigns.value.data;
    }

    if (promotions.status === 'fulfilled' && promotions.value.data) {
      staticProps.props.promotions = promotions.value.data;
    }
  } catch (error) {
    // do nothing
    console.error('file: index.tsx:370 | error:', error);
  }

  return staticProps;
};
