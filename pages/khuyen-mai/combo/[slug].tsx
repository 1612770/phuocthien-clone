import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from '../../page';
import { Typography } from 'antd';
import { ComboPromotion, PromotionClient } from '@libs/client/Promotion';
import { GetServerSidePropsContext } from 'next';
import ComboPromotionSection from '@modules/promotion/ComboPromotionSection';
import ComboPromotionnHeader from '@modules/promotion/ComboPromotionnHeader';
import ComboPromotionBody from '@modules/promotion/ComboPromotionBody';
import ComboPromotionItem from '@modules/promotion/ComboPromotionItem';

const Home: NextPageWithLayout<{
  comboPromotions: ComboPromotion[];
}> = ({ comboPromotions }) => {
  return (
    <ComboPromotionSection>
      <ComboPromotionnHeader>
        <Typography.Title level={3}>
          Combo khuyến mãi ({comboPromotions.length})
        </Typography.Title>
      </ComboPromotionnHeader>
      <ComboPromotionBody>
        {comboPromotions.map((comboPromotion) => (
          <ComboPromotionItem
            key={comboPromotion.promotionId}
            comboPromotion={comboPromotion}
          />
        ))}
      </ComboPromotionBody>
    </ComboPromotionSection>
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
      comboPromotions: ComboPromotion[];
    };
  } = {
    props: {
      comboPromotions: [],
    },
  };

  const promotionClient = new PromotionClient(context, {});
  const slug = context.params?.slug as string;
  try {
    const [comboPromotions] = await Promise.all([
      promotionClient.getPromotionCombo({
        slug,
      }),
    ]);

    serverSideProps.props.comboPromotions = comboPromotions.data || [];
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};
