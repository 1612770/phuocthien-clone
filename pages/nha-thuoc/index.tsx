import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { Empty, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { DrugstoreClient } from '@libs/client/DrugStore';
import DrugStore from '@configs/models/drug-store.model';
import DrugstoreItem from '@modules/drugstore/DrugstoreItem';
import Breadcrumbs from '@components/Breadcrumbs';

const DrugstorePage: NextPageWithLayout<{
  drugstores?: DrugStore[];
}> = ({ drugstores }) => {
  return (
    <div className="mx-auto  px-4 pb-8 lg:container lg:px-0">
      <Breadcrumbs
        className="mb-4 pt-4"
        breadcrumbs={[
          {
            title: 'Trang chủ',
            path: '/',
          },
          {
            title: 'Danh sách nhà thuốc',
          },
        ]}
      ></Breadcrumbs>

      <Typography.Title
        level={1}
        className="mt-8 mb-6 text-2xl font-medium md:text-4xl"
      >
        Hệ thống các chi nhánh nhà thuốc Phước Thiện
      </Typography.Title>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
        {drugstores?.map((drugStore) => (
          <DrugstoreItem
            variant="card"
            drugstore={drugStore}
            key={drugStore.key}
          />
        ))}
      </div>

      {!drugstores?.length && (
        <Empty
          className="my-8"
          description={<Typography>Không có nhà thuốc nào</Typography>}
        ></Empty>
      )}
    </div>
  );
};

export default DrugstorePage;

DrugstorePage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const staticProps: ReturnType<
    GetStaticProps<{
      drugstores?: DrugStore[];
    }>
  > = {
    props: {
      drugstores: [],
    },
    revalidate: 86400, // 1 hour
  };

  const drugstoreClient = new DrugstoreClient(context, {});

  try {
    const [drugstores] = await Promise.all([
      drugstoreClient.getAllDrugStores(),
    ]);

    if (drugstores.data) {
      staticProps.props.drugstores = drugstores.data || [];
    }
  } catch (error) {
    console.error(error);
  }

  return staticProps;
};
