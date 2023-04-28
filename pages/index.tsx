import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { GetServerSidePropsContext } from 'next';
import { ProductClient } from '@libs/client/Product';
import HomepageCarousel from '@modules/homepage/HomepageCarousel';
import HomepageSearchSection from '@modules/homepage/HomepageSearchSection';
import ViralProductsListModel from '@configs/models/viral-products-list.model';
import FocusContentSection from '@modules/homepage/FocusContentSection';
import VIRAL_PRODUCTS_LOAD_PER_TIME from '@configs/constants/viral-products-load-per-time';
import dynamic from 'next/dynamic';
import { useAppData } from '@providers/AppDataProvider';
import { GeneralClient } from '@libs/client/General';
import SlideBannerModel from '@configs/models/slide-banner.model';
import ProductSearchKeyword from '@configs/models/product-search-keyword.model';
import { useEffect } from 'react';
import MainInfoModel from '@configs/models/main-info.model';
import { PromotionClient } from '@libs/client/Promotion';
import { Campaign } from '@configs/models/promotion.model';
import { getVisibleItems } from '@libs/helpers';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

const PromotionProductsList = dynamic(
  () => import('@modules/products/PromotionProductsList'),
  {}
);

const ViralProductsList = dynamic(
  () => import('@modules/products/ViralProductsList'),
  {}
);

const MainInfoSection = dynamic(
  () => import('@modules/homepage/MainInfoSection'),
  {}
);

const Home: NextPageWithLayout<{
  viralProductsLists?: ViralProductsListModel[];
  slideBanner?: SlideBannerModel[];
  productSearchKeywords?: ProductSearchKeyword[];
  mainInfos?: MainInfoModel[];
  campaigns?: Campaign[];
  campaignsDetail: Campaign[];
}> = ({
  viralProductsLists,
  slideBanner,
  productSearchKeywords,
  mainInfos,
  campaigns,
  campaignsDetail,
}) => {
  const { focusContent, setProductSearchKeywords } = useAppData();

  const sliderImages =
    campaigns?.map((campaign) => ({
      url: campaign.imgUrl,
      link: '/chuong-trinh-khuyen-mai/' + campaign.key,
    })) || [];
  const visibleSlides = getVisibleItems(slideBanner || []).map((slide) => ({
    url: (slide.imageUrl as string) || '',
  }));

  useEffect(() => {
    setProductSearchKeywords(productSearchKeywords || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const screens = useBreakpoint();

  return (
    <div className="mb-0 lg:mb-8">
      <div className="w-screen overflow-hidden pb-6">
        {!!sliderImages.length && (
          <HomepageCarousel
            sliderImages={sliderImages}
            numberSlidePerPage={1}
            type="primary"
          />
        )}
        <div
          className={`px-2 md:px-0 ${
            sliderImages.length && screens.md ? `container -mt-[100px]` : ''
          }`}
        >
          <HomepageCarousel
            sliderImages={visibleSlides}
            numberSlidePerPage={sliderImages.length && screens.md ? 2 : 1}
            type={sliderImages.length ? 'secondary' : 'primary'}
          />
        </div>
      </div>

      <div
        className={`hidden lg:block ${
          !sliderImages.length ? `-mt-[100px]` : 'mt-[32px]'
        }`}
      >
        <HomepageSearchSection />
      </div>

      <div className="mt-[32px] hidden lg:block">
        <FocusContentSection focusContent={focusContent || []} />
      </div>

      {campaignsDetail.map((campaign) => {
        return campaign.promotions.map((promotion, index) => {
          return (
            <PromotionProductsList
              key={promotion.key}
              promotion={promotion}
              isPrimaryBackground={index === 0}
              scrollable={!screens.md}
            />
          );
        });
      })}

      {viralProductsLists?.map((viralProductsList, index) => (
        <ViralProductsList
          key={viralProductsList.key}
          viralProductsList={viralProductsList}
          invertBackground={
            index % 2 === 1 && index !== viralProductsLists.length - 1
          }
        />
      ))}

      <MainInfoSection mainInfo={mainInfos?.[0]}></MainInfoSection>
    </div>
  );
};

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
      viralProductsLists: ViralProductsListModel[];
      slideBanner: SlideBannerModel[];
      productSearchKeywords: ProductSearchKeyword[];
      mainInfos: MainInfoModel[];
      campaigns: Campaign[];
      campaignsDetail: Campaign[];
    };
  } = {
    props: {
      viralProductsLists: [],
      slideBanner: [],
      productSearchKeywords: [],
      mainInfos: [],
      campaigns: [],
      campaignsDetail: [],
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
      }),
    ]);

    if (viralProducts.status === 'fulfilled' && viralProducts.value.data) {
      serverSideProps.props.viralProductsLists = viralProducts.value.data || [];
    }

    if (slideBanner.status === 'fulfilled' && slideBanner.value.data) {
      serverSideProps.props.slideBanner = slideBanner.value.data || [];
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

      const campaignsDetail = await Promise.all(
        campaigns.value.data.map((campaign) =>
          promotionClient.getPromo({
            page: 1,
            pageSize: 20,
            keyCampaign: campaign.key,
          })
        )
      );

      serverSideProps.props.campaignsDetail = campaignsDetail.map(
        (campaignDetail) =>
          campaignDetail.data?.length ? campaignDetail.data?.[0] : null
      ) as Campaign[];
    }
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};
