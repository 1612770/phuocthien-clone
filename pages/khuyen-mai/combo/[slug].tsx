import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from '../../page';
import { Divider, Empty, Spin, Typography } from 'antd';
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
import { ChevronsDown } from 'react-feather';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

interface ComboPromotionPageProps {
  comboPromotions?: ComboPromotionModel[];
  promotion: ArrayElement<PromotionModel['promotions']> | null;
}

const Home: NextPageWithLayout<ComboPromotionPageProps> = ({
  comboPromotions,
  promotion,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [canLoadMore, setCanLoadMore] = useState(
    comboPromotions?.length === 10
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [localComboPromotions, setLocalComboPromotions] = useState<
    ComboPromotionModel[]
  >(comboPromotions || []);
  const router = useRouter();

  useEffect(() => {
    setLocalComboPromotions(comboPromotions || []);

    return () => {
      setPage(1);
      setLocalComboPromotions([]);
    };
  }, [comboPromotions]);

  const handleLoadMore = async () => {
    const promotionClient = new PromotionClient(null, {});

    setLoadingMore(true);
    const resComboPromotions = await promotionClient.getPromotionCombo({
      filterByPromoSlug: router.query.slug as string,
      page: page + 1,
      pageSize: pageSize,
    });

    if (resComboPromotions.data && !!resComboPromotions.data.data.length) {
      setLocalComboPromotions([
        ...localComboPromotions,
        ...resComboPromotions.data.data,
      ]);
    }

    if ((resComboPromotions.data?.data || []).length < pageSize) {
      setCanLoadMore(false);
    }

    setPage(page + 1);
    setLoadingMore(false);
  };

  if (!localComboPromotions?.length) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không có combo nào"
        />
      </div>
    );
  }

  return (
    <div>
      {promotion?.imgUrl && (
        <div className="mb-0 md:mb-6">
          <Divider className="m-0" />
          <div className="relative h-[30vh]">
            <ImageWithFallback
              src={promotion?.imgUrl || ''}
              layout="fill"
              style={{ objectFit: 'cover' }}
              objectFit="cover"
            ></ImageWithFallback>
          </div>
          <Divider className="m-0" />
        </div>
      )}
      <ComboPromotionSection>
        <ComboPromotionnHeader>
          <Typography.Title
            level={2}
            className="m-0 text-center text-lg font-bold text-primary-light md:text-xl md:font-semibold"
          >
            {promotion?.name}
          </Typography.Title>
          <Typography.Paragraph className="m-0 text-center text-sm font-normal text-gray-600 md:text-base">
            {localComboPromotions?.length || 0} combo dành cho bạn
          </Typography.Paragraph>
        </ComboPromotionnHeader>
        <ComboPromotionBody>
          {localComboPromotions?.map((comboPromotion) => (
            <ComboPromotionItem
              key={comboPromotion.promotionKey}
              comboPromotion={comboPromotion}
            />
          ))}

          {canLoadMore && (
            <Spin spinning={loadingMore}>
              <div
                className="mt-4 cursor-pointer text-center text-primary"
                onClick={handleLoadMore}
              >
                <ChevronsDown />
                <div>Xem thêm</div>
              </div>
            </Spin>
          )}
        </ComboPromotionBody>
      </ComboPromotionSection>
    </div>
  );
};

export default Home;
Home.getLayout = (page) => {
  return <PrimaryLayout background="primary">{page}</PrimaryLayout>;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: ComboPromotionPageProps;
  } = {
    props: {
      promotion: null,
    },
  };

  const promotionClient = new PromotionClient(context, {});
  const slug = context.params?.slug as string;
  try {
    const [comboPromotions, promotion] = await Promise.all([
      promotionClient.getPromotionCombo({
        filterByPromoSlug: slug,
        page: 1,
        pageSize: 10,
      }),
      promotionClient.getPromotions({
        promoSlug: slug,
      }),
    ]);

    serverSideProps.props.comboPromotions = comboPromotions.data?.data;
    serverSideProps.props.promotion =
      promotion.data?.[0]?.promotions?.[0] || null;
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};
