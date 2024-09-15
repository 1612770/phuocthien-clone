import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from '../../page';
import { Divider, Typography } from 'antd';
import { PromotionClient } from '@libs/client/Promotion';
import { GetServerSidePropsContext } from 'next';
import ComboPromotionSection from '@modules/promotion/ComboPromotionSection';
import ComboPromotionnHeader from '@modules/promotion/ComboPromotionnHeader';
import ComboPromotionBody from '@modules/promotion/ComboPromotionBody';
import ComboPromotionItem from '@modules/promotion/ComboPromotionItem';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import {
  ComboPromotionModel,
  PromotionModel,
} from '@configs/models/promotion.model';

interface ComboPromotionPageProps {
  comboPromotions?: ComboPromotionModel[];
  promotion?: PromotionModel;
}

const Home: NextPageWithLayout<ComboPromotionPageProps> = ({
  comboPromotions,
  promotion,
}) => {
  return (
    <ComboPromotionSection>
      {promotion?.imgUrl && (
        <div className="mb-6">
          <Divider className="m-0" />
          <div className="relative h-[200px]">
            <ImageWithFallback
              src={promotion?.imgUrl || ''}
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
          ({comboPromotions?.length} combo khuyến mãi)
        </Typography.Paragraph>
      </ComboPromotionnHeader>
      <ComboPromotionBody>
        {comboPromotions?.map((comboPromotion) => (
          <ComboPromotionItem
            key={comboPromotion.promotionKey}
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
    props: {},
  };

  const promotionClient = new PromotionClient(context, {});
  const slug = context.params?.slug as string;
  try {
    const [comboPromotions, promotion] = await Promise.all([
      promotionClient.getPromotionCombo({
        filterByPromoSlug: slug,
      }),
      promotionClient.getPromotion({
        promoSlug: slug,
      }),
    ]);

    serverSideProps.props.comboPromotions = comboPromotions.data?.data;
    serverSideProps.props.promotion = promotion.data?.[0];
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};
