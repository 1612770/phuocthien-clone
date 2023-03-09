import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { GetServerSidePropsContext } from 'next';
import { ProductClient } from '@libs/client/Product';
import { Pagination, Typography } from 'antd';
import ProductCard from '@components/templates/ProductCard';
import { useRouter } from 'next/router';
import VIRAL_PRODUCTS_LOAD_PER_TIME from '@configs/constants/viral-products-load-per-time';
import ViralProductsListModel from '@configs/models/viral-products-list.model';
import { NextPageWithLayout } from 'pages/page';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';

const ViralGroupPage: NextPageWithLayout<{
  viralProductsLists?: ViralProductsListModel[];
}> = ({ viralProductsLists }) => {
  const router = useRouter();

  return (
    <div className="mx-auto  px-4 pb-8 lg:container lg:px-0">
      <Typography.Title level={1} className="mt-8 mb-2 font-medium">
        {viralProductsLists?.[0]?.name}
      </Typography.Title>

      {viralProductsLists?.[0]?.imageUrl && (
        <div className="relative mb-4 h-[200px] w-full">
          <ImageWithFallback
            src={viralProductsLists?.[0]?.imageUrl || ''}
            layout="fill"
            objectFit="cover"
            getMockImage={() => ImageUtils.getRandomMockCampaignImageUrl()}
          ></ImageWithFallback>
        </div>
      )}

      {(viralProductsLists?.[0].listProductViral?.length || 0) > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {viralProductsLists?.[0].listProductViral?.map(
              (product) =>
                product.productInfo && (
                  <div key={product.key}>
                    <ProductCard product={product.productInfo} />
                  </div>
                )
            )}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <Pagination
          pageSize={VIRAL_PRODUCTS_LOAD_PER_TIME}
          onChange={(page) => {
            router.replace({
              query: {
                ...router.query,
                trang: page,
              },
            });
          }}
          total={viralProductsLists?.[0].totalProductViral || 0}
          className="mt-4"
          current={+(router.query?.trang || 1)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default ViralGroupPage;

ViralGroupPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
      viralProductsLists: ViralProductsListModel[];
    };
  } = {
    props: {
      viralProductsLists: [],
    },
  };

  const productClient = new ProductClient(context, {});

  try {
    const [viralProducts] = await Promise.all([
      productClient.getViralProducts({
        page: +(context.query?.trang || 1),
        pageSize: VIRAL_PRODUCTS_LOAD_PER_TIME,
        key: context.params?.viralGroupKey as string,
      }),
    ]);

    if (viralProducts.data) {
      serverSideProps.props.viralProductsLists = viralProducts.data || [];
    }
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};
