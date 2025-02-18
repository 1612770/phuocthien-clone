import PrimaryLayout from 'components/layouts/PrimaryLayout';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { Breadcrumb, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { DrugstoreClient } from '@libs/client/DrugStore';
import DrugStore from '@configs/models/drug-store.model';
import { MapPin, Phone } from 'react-feather';
import { useRouter } from 'next/router';

const DrugstorePage: NextPageWithLayout<{
  drugstore?: DrugStore;
}> = ({ drugstore }) => {
  const router = useRouter();
  return (
    <div className="mx-auto  px-4 pb-8 lg:container lg:px-0">
      <Breadcrumb className="mt-4 mb-2">
        <Breadcrumb.Item>
          <span onClick={() => router.push('/')} className="cursor-pointer">
            Trang chủ
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span
            onClick={() => router.push('/nha-thuoc')}
            className="cursor-pointer"
          >
            Danh sách nhà thuốc
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{drugstore?.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Typography.Title
        level={1}
        className="mt-8 mb-2 text-2xl font-medium md:text-4xl"
      >
        {drugstore?.name}
      </Typography.Title>

      {drugstore?.image && (
        <div className="relative mb-4 h-[240px] w-full">
          <ImageWithFallback
            src={drugstore?.image || ''}
            layout="fill"
            objectFit="cover"
          ></ImageWithFallback>
        </div>
      )}

      <div className="my-4 flex items-center">
        <MapPin size={20} />
        <div className="ml-4">
          <Typography.Text>Địa chỉ: </Typography.Text>
          <Typography.Text>{drugstore?.address}</Typography.Text>
        </div>
      </div>
      <div className="my-4 flex items-center">
        <Phone size={20} />
        <div className="ml-4">
          <Typography.Text>Số điện thoại: </Typography.Text>
          <Typography.Text>{drugstore?.tel}</Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default DrugstorePage;

DrugstorePage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export const getStaticPaths: GetStaticPaths = async (
  context: GetStaticPathsContext
) => {
  const drugstoreClient = new DrugstoreClient(context, {});

  const drugstores = await drugstoreClient.getAllDrugStores();

  const paths = (drugstores.data || []).reduce((acc, drugstore) => {
    if (drugstore.seoUrl) {
      return [
        ...acc,
        {
          params: {
            slug: drugstore.seoUrl,
          },
        },
      ];
    }
    return acc;
  }, [] as { params: { slug: string } }[]);

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const staticProps: ReturnType<
    GetStaticProps<{
      drugstore?: DrugStore;
    }>
  > = {
    props: {},
    revalidate: 86400, // 1 day
  };

  const drugstoreClient = new DrugstoreClient(context, {});

  try {
    const [drugstore] = await Promise.all([
      drugstoreClient.getDrugStore({
        key: context.params?.slug as string,
      }),
    ]);

    if (drugstore.data) {
      staticProps.props.drugstore = drugstore.data || undefined;
    }
  } catch (error) {
    console.error(error);
  }

  return staticProps;
};
