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

const ViralProductsList = dynamic(
  () => import('@modules/products/ViralProductsList'),
  {}
);

const Home: NextPageWithLayout<{
  viralProductsLists?: ViralProductsListModel[];
  slideBanner?: SlideBannerModel[];
}> = ({ viralProductsLists, slideBanner }) => {
  const { focusContent } = useAppData();

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
    };
  } = {
    props: {
      viralProductsLists: [],
      slideBanner: [],
    },
  };

  const productClient = new ProductClient(context, {});
  const generalClient = new GeneralClient(context, {});

  try {
    const [viralProducts, slideBanner] = await Promise.all([
      productClient.getViralProducts({
        page: 1,
        pageSize: VIRAL_PRODUCTS_LOAD_PER_TIME,
      }),
      generalClient.getSlideBanner(),
    ]);

    if (viralProducts.data) {
      serverSideProps.props.viralProductsLists = viralProducts.data || [];
    }

    if (slideBanner.data) {
      serverSideProps.props.slideBanner = slideBanner.data || [];
    }
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};
