import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from '../page';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { Typography } from 'antd';
import Product from '@configs/models/product.model';
import { PromotionClient } from '@libs/client/Promotion';
import { Campaign } from '@configs/models/promotion.model';
import { GetServerSidePropsContext } from 'next';
import PromotionProductsList from '@modules/products/PromotionProductsList';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const getPromotionId = (id: string) => {
  return `promotion-section-${id}`;
};

const Home: NextPageWithLayout<{
  campaign: Campaign;
  products: Product[];
}> = ({ campaign }) => {
  const router = useRouter();

  useEffect(() => {
    scrollIntoView(router.query.anchor as string);
  }, [router]);

  if (!campaign) return null;

  const promotions = campaign.promotions;

  const scrollIntoView = (id: string) => {
    const element = document.getElementById(getPromotionId(id));
    const headerHeight = 48;
    const offsetTop = element?.offsetTop || 0;

    if (element) {
      window.scrollTo({
        top: offsetTop - headerHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="pb-0 lg:pb-8">
      <div className="relative h-[200px] w-full lg:h-[400px]">
        <ImageWithFallback
          src={campaign.imgUrl}
          priority
          alt="chuong trinh khuyen mai"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className="sticky top-0 z-10 bg-primary-light">
        <div className="container flex gap-2 overflow-auto px-2 py-2 sm:justify-start md:px-0 lg:justify-center">
          {(promotions || []).map((promotion) => (
            <div
              className="cursor-pointer rounded-full border border-solid border-white px-4 py-1 text-white transition-all duration-200 ease-in-out hover:bg-white hover:text-primary"
              key={promotion.key}
              onClick={() => scrollIntoView(promotion.key)}
            >
              <Typography.Text className="whitespace-nowrap text-inherit transition-all duration-200 ease-in-out">
                {promotion.name}
              </Typography.Text>
            </div>
          ))}
        </div>
      </div>

      {promotions.map((promotion, index) => (
        <PromotionProductsList
          id={getPromotionId(promotion.key)}
          promotion={promotion}
          isPrimaryBackground={index === 0}
          key={index}
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
      campaign?: Campaign;
      promoProductsLists: Product[];
    };
  } = {
    props: {
      promoProductsLists: [],
    },
  };

  const promotionClient = new PromotionClient(context, {});
  const campaignId = context.params?.campaignId as string;

  try {
    const [campaigns] = await Promise.allSettled([
      promotionClient.getPromo({
        page: 1,
        pageSize: 20,
        keyCampaign: campaignId,
      }),
    ]);

    if (campaigns.status === 'fulfilled' && campaigns.value.data) {
      if (!campaigns.value.data.length) {
        return {
          notFound: true,
        };
      }

      serverSideProps.props.campaign = campaigns.value.data[0];
    }
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};
