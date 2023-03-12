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
}> = ({
  viralProductsLists,
  slideBanner,
  productSearchKeywords,
  mainInfos,
}) => {
  const { focusContent, setProductSearchKeywords } = useAppData();

  useEffect(() => {
    setProductSearchKeywords(productSearchKeywords || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mb-0 lg:mb-8">
      <HomepageCarousel slideBanner={slideBanner || []} />

      <div className="-mt-20 hidden lg:block">
        <HomepageSearchSection />
      </div>

      <div className="mt-[32px] hidden lg:block">
        <FocusContentSection focusContent={focusContent || []} />
      </div>
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
    };
  } = {
    props: {
      viralProductsLists: [],
      slideBanner: [],
      productSearchKeywords: [],
      mainInfos: [],
    },
  };

  const productClient = new ProductClient(context, {});
  const generalClient = new GeneralClient(context, {});

  try {
    const [viralProducts, slideBanner, productSearchKeywords, mainInfos] =
      await Promise.allSettled([
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
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};
