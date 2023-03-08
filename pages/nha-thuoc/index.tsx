import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { GetServerSidePropsContext } from 'next';
import { Breadcrumb, Empty, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { DrugstoreClient } from '@libs/client/DrugStore';
import DrugStore from '@configs/models/drug-store.model';
import Link from 'next/link';
import DrugstoreItem from '@modules/drugstore/DrugstoreItem';

const DrugstorePage: NextPageWithLayout<{
  drugstores?: DrugStore[];
}> = ({ drugstores }) => {
  return (
    <div className="mx-auto  px-4 pb-8 lg:container lg:px-0">
      <Breadcrumb className="mt-4 mb-2">
        <Breadcrumb.Item>
          <Link href="/">
            <a>Trang chủ</a>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Danh sách nhà thuốc</Breadcrumb.Item>
      </Breadcrumb>

      <Typography.Title level={1} className="mt-8 mb-6 font-medium">
        Hệ thống các chi nhánh nhà thuốc Phước Thiện
      </Typography.Title>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
      drugstores?: DrugStore[];
    };
  } = {
    props: {
      drugstores: [],
    },
  };

  const drugstoreClient = new DrugstoreClient(context, {});

  try {
    const [drugstores] = await Promise.all([
      drugstoreClient.getAllDrugStores(),
    ]);

    if (drugstores.data) {
      serverSideProps.props.drugstores = drugstores.data || [];
    }
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};
