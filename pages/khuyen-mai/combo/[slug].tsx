import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from '../../page';
import { Divider, Typography } from 'antd';
import { ComboPromotion, PromotionClient } from '@libs/client/Promotion';
import { GetServerSidePropsContext } from 'next';
import ComboPromotionSection from '@modules/promotion/ComboPromotionSection';
import ComboPromotionnHeader from '@modules/promotion/ComboPromotionnHeader';
import ComboPromotionBody from '@modules/promotion/ComboPromotionBody';
import ComboPromotionItem from '@modules/promotion/ComboPromotionItem';
import { Promotion } from '@configs/models/promotion.model';
import ImageWithFallback from '@components/templates/ImageWithFallback';

interface ComboPromotionPageProps {
  comboPromotions: ComboPromotion[];
  promotion?: Promotion;
}

const Home: NextPageWithLayout<ComboPromotionPageProps> = ({
  comboPromotions,
  promotion,
}) => {
  return (
    <ComboPromotionSection>
      {promotion?.imageUrl && (
        <div className="mb-6">
          <Divider className="m-0" />
          <div className="relative h-[200px]">
            <ImageWithFallback
              src={promotion?.imageUrl || ''}
              layout="fill"
              objectFit="cover"
            ></ImageWithFallback>
          </div>
          <Divider className="m-0" />
        </div>
      )}

      <ComboPromotionnHeader>
        <Typography.Title level={3} className="m-0 text-center">
          {promotion?.name}
        </Typography.Title>
        <Typography.Paragraph className="m-0 text-center text-xl text-gray-600">
          ({comboPromotions.length} combo khuyến mãi)
        </Typography.Paragraph>
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
    props: ComboPromotionPageProps;
  } = {
    props: {
      comboPromotions: [],
    },
  };

  const promotionClient = new PromotionClient(context, {});
  const slug = context.params?.slug as string;
  try {
    const [comboPromotions, promotion] = await Promise.all([
      promotionClient.getPromotionCombo({
        promotionSlug: slug,
      }),
      promotionClient.getPromotion({
        promotionSlug: slug,
      }),
    ]);

    serverSideProps.props.comboPromotions = comboPromotions.data || [];
    serverSideProps.props.promotion = promotion.data?.[0];
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};
