import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { GetServerSidePropsContext } from 'next';
import { ProductClient } from '@libs/client/Product';
import HomepageCarousel from '@modules/homepage/HomepageCarousel';
import HomepageSearchSection from '@modules/homepage/HomepageSearchSection';
import ViralProductsListModel from '@configs/models/viral-products-list.model';
import VIRAL_PRODUCTS_LOAD_PER_TIME from '@configs/constants/viral-products-load-per-time';
import dynamic from 'next/dynamic';
import { useAppData } from '@providers/AppDataProvider';
import { GeneralClient } from '@libs/client/General';
import SlideBannerModel from '@configs/models/slide-banner.model';
import ProductSearchKeyword from '@configs/models/product-search-keyword.model';
import { useEffect } from 'react';
import MainInfoModel from '@configs/models/main-info.model';
import { PromotionClient } from '@libs/client/Promotion';
import { Campaign, Promotion } from '@configs/models/promotion.model';
import { getVisibleItems } from '@libs/helpers';
import { Col, Grid, Row } from 'antd';
import Product from '@configs/models/product.model';
import { BANNER_ENABLED } from '@configs/env';
import IMAGES from '@configs/assests/images';
import HomepageCarouselEvent from '@modules/homepage/HomeCarouselEvent';
import BrandModel from '@configs/models/brand.model';

const { useBreakpoint } = Grid;

const ViralProductsList = dynamic(
  () => import('@modules/products/ViralProductsList'),
  { ssr: false }
);

const MainInfoSection = dynamic(
  () => import('@modules/homepage/MainInfoSection'),
  { ssr: false }
);

const HomepageBrands = dynamic(
  () => import('@modules/homepage/HomepageBrands'),
  { ssr: false }
);

interface HomeProps {
  viralProductsLists?: ViralProductsListModel[];
  slideBanner?: SlideBannerModel[];
  productSearchKeywords?: ProductSearchKeyword[];
  mainInfos?: MainInfoModel[];
  campaigns?: Campaign[];
  listProducts?: Product[][];
  brands: BrandModel[];
  promotions: Promotion[];
}

const Home: NextPageWithLayout<HomeProps> = ({
  viralProductsLists,
  slideBanner,
  productSearchKeywords,
  mainInfos,
  campaigns,
  brands,
  promotions,
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
    <div className="mb-0 lg:mb-8">
      <div className="w-screen overflow-hidden pb-4">
        <div
          className={`px-0 ${
            promotionSliderImages.length && screens.md ? `container` : ''
          }`}
        >
          <div>
            <Row>
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
                className="w-full"
              >
                {/* <Row className="mt-4">asd</Row> */}
                <Row className="mt-4 mb-4 flex max-h-[150px]  items-center justify-between gap-2 px-4 lg:justify-center">
                  <div
                    onClick={() =>
                      window.open(
                        'https://zalo.me/phuocthienpharmacy',
                        '_blank'
                      )
                    }
                    className="flex-1 flex-col items-center rounded-xl border-solid border-gray-50 bg-white p-5 shadow-md hover:cursor-pointer hover:border-primary"
                  >
                    <img
                      src={IMAGES.bill}
                      alt="bill"
                      className="fill-bg-primary h-12 w-full"
                      style={{ minHeight: 32 }}
                    />
                    <div className="mt-4 text-center text-xs">Gửi toa</div>
                  </div>
                  <div
                    onClick={() =>
                      window.open(
                        'https://zalo.me/phuocthienpharmacy',
                        '_blank'
                      )
                    }
                    className="flex-1 flex-col items-center rounded-xl border-solid border-gray-50 bg-white p-5 shadow-md hover:cursor-pointer hover:border-primary"
                  >
                    <img
                      src={IMAGES.doctor}
                      alt="bill"
                      className="fill-bg-primary h-12 w-full"
                      // style={{ minHeight: 32 }}
                    />
                    <div className="mt-4 text-center text-xs">Tư vấn</div>
                  </div>
                  <div
                    onClick={() =>
                      window.open(
                        'https://zalo.me/phuocthienpharmacy',
                        '_blank'
                      )
                    }
                    className="flex-1 flex-col items-center rounded-xl border-solid border-gray-50 bg-white p-5 shadow-md hover:cursor-pointer hover:border-primary"
                  >
                    <img
                      src={IMAGES.drug}
                      alt="bill"
                      className="fill-bg-primary h-12 w-full"
                      style={{ minHeight: 32 }}
                    />
                    <div className="mt-4 text-center text-xs">Mua thuốc</div>
                  </div>
                </Row>
                <Row className="hidden lg:relative lg:block lg:h-[150px] lg:max-h-[150px]">
                  <HomepageCarouselEvent
                    mainInfos={mainInfos ? mainInfos[0] : undefined}
                  />
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </div>

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
          <ViralProductsList
            key={viralProductsList.key}
            viralProductsList={viralProductsList}
            invertBackground={
              index % 2 === 1 && index !== viralProductsLists.length - 1
            }
          />
        ))}
      {brands?.length > 0 && (
        <div className="relative">
          <HomepageBrands brands={brands} />
        </div>
      )}
      <MainInfoSection mainInfo={mainInfos?.[0]}></MainInfoSection>
    </div>
  );
};

export default Home;

Home.getLayout = (page) => {
  const showSearch = !!page.props.campaigns?.length;
  return <PrimaryLayout showSearch={showSearch}>{page}</PrimaryLayout>;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: HomeProps;
  } = {
    props: {
      viralProductsLists: [],
      slideBanner: [],
      productSearchKeywords: [],
      mainInfos: [],
      campaigns: [],
      listProducts: [],
      brands: [],
      promotions: [],
    },
  };

  const productClient = new ProductClient(context, {});
  const generalClient = new GeneralClient(context, {});
  const promotionClient = new PromotionClient(context, {});

  try {
    const [
      viralProducts,
      slideBanner,
      productSearchKeywords,
      mainInfos,
      campaigns,
      brands,
      promotions,
    ] = await Promise.allSettled([
      productClient.getViralProducts({
        page: 1,
        pageSize: VIRAL_PRODUCTS_LOAD_PER_TIME,
      }),
      generalClient.getSlideBanner(),
      generalClient.getProductSearchKeywords(),
      generalClient.getMainInfos({
        page: 1,
        pageSize: 5,
        mainInfoCode: +(process.env.MAIN_INFO_CODE_HOMEPAGE_LOAD || 0),
      }),
      promotionClient.getPromo({
        page: 1,
        pageSize: 20,
        isHide: false,
      }),
      generalClient.getProductionBrands(),
      promotionClient.getPromotion({
        isHide: false,
      }),
    ]);

    if (viralProducts.status === 'fulfilled' && viralProducts.value.data) {
      serverSideProps.props.viralProductsLists = viralProducts.value.data || [];
    }

    if (slideBanner.status === 'fulfilled' && slideBanner.value.data) {
      serverSideProps.props.slideBanner = slideBanner.value.data || [];
    }
    if (brands.status === 'fulfilled' && brands.value.data) {
      serverSideProps.props.brands = brands.value.data || [];
    }

    if (
      productSearchKeywords.status === 'fulfilled' &&
      productSearchKeywords.value.data
    ) {
      serverSideProps.props.productSearchKeywords =
        productSearchKeywords.value.data || [];
    }

    if (mainInfos.status === 'fulfilled' && mainInfos.value.data) {
      serverSideProps.props.mainInfos =
        mainInfos.value.data.map((main) => ({
          ...main,
          groupInfo: main.groupInfo?.map((group) => ({
            ...group,
            eventInfos: group.eventInfos?.slice(0, 4),
          })),
        })) || [];
    }

    if (campaigns.status === 'fulfilled' && campaigns.value.data) {
      serverSideProps.props.campaigns = campaigns.value.data;
    }

    if (promotions.status === 'fulfilled' && promotions.value.data) {
      serverSideProps.props.promotions = promotions.value.data;
    }
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};
