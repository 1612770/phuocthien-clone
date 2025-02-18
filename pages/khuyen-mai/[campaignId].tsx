import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from '../page';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { Typography } from 'antd';
import Product from '@configs/models/product.model';
import { PromotionClient } from '@libs/client/Promotion';
import { Campaign, CampaignPromotion } from '@configs/models/promotion.model';
import { GetServerSidePropsContext } from 'next';
import PromotionProductsList from '@modules/products/PromotionProductsList';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import { convertFromStringToHTML } from '@libs/helpers';

const getPromotionId = (id: string) => {
  return `promotion-section-${id}`;
};

export const MAX_PRODUCT_PER_PAGE = 20;

const Home: NextPageWithLayout<{
  campaign: Campaign;
  listProducts: Product[][];
}> = ({ campaign, listProducts }) => {
  const router = useRouter();

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

  useEffect(() => {
    scrollIntoView(router.query.anchor as string);
  }, [router]);

  if (!campaign) return null;

  const campaignPromotions = campaign.promotions;

  return (
    <>
      {campaign.metaSeo && (
        <Head>{convertFromStringToHTML(campaign.metaSeo)}</Head>
      )}
      <section className="pb-0 lg:container lg:pb-8">
        <div className="relative aspect-[3/1] ">
          <ImageWithFallback
            src={campaign.imgUrl}
            priority
            alt="chuong trinh khuyen mai"
            layout="fill"
            objectFit="cover"
            sizes="(min-width: 1024px) 800px, (min-width: 768px) 600px, 400px"
            objectPosition="center"
          />
        </div>
        <div className=" z-[100] bg-primary-light">
          <div className="container flex justify-center gap-2 overflow-auto px-2 py-2 md:px-0 lg:justify-center">
            {(campaignPromotions || []).map((promotion) => (
              <div
                className="cursor-pointer rounded-full border border-solid border-white px-4 py-1 text-white transition-all duration-200 ease-in-out hover:bg-white hover:text-primary"
                key={promotion.key}
                onClick={() => {
                  if (promotion.type === 'PRODUCT_COMBO') {
                    router.push(`/khuyen-mai/combo/${promotion.slug}`);
                    return;
                  }

                  scrollIntoView(promotion.key);
                }}
              >
                <Typography.Text className="whitespace-nowrap  capitalize text-inherit transition-all duration-200 ease-in-out">
                  {promotion.name}
                </Typography.Text>
              </div>
            ))}
          </div>
        </div>

        {listProducts?.map((listProduct, index) => {
          if (!listProducts.length) return null;
          const keyPromo = listProduct[0]?.keyPromo;
          if (!keyPromo) {
            return null;
          }
          const promotion = campaignPromotions.find(
            (promotion) => promotion.key === keyPromo
          );
          if (!promotion) return null;

          return (
            <PromotionProductsList
              id={getPromotionId(promotion.key)}
              promotion={promotion}
              isPrimaryBackground={index === 0}
              key={index}
              defaultProducts={listProduct}
            />
          );
        })}
      </section>
    </>
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
      listProducts?: Product[][];
    };
  } = {
    props: {
      listProducts: [],
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
        isHide: false,
      }),
    ]);

    if (campaigns.status === 'fulfilled' && campaigns.value.data) {
      if (!campaigns.value.data.length) {
        return {
          notFound: true,
        };
      }

      serverSideProps.props.campaign = campaigns.value.data[0];

      const promotions = campaigns.value.data.reduce((acc, curCampaign) => {
        return [...acc, ...curCampaign.promotions];
      }, [] as CampaignPromotion[]);

      const [...listProducts] = await Promise.all([
        ...promotions.map((promotion) =>
          promotionClient.getPromoProducts({
            page: 1,
            pageSize: MAX_PRODUCT_PER_PAGE,
            keyPromo: promotion.key,
            isHide: false,
          })
        ),
      ]);

      serverSideProps.props.listProducts = listProducts.map(
        (listProducts) => listProducts.data
      ) as Product[][];
    }
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};
