import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Product from '@configs/models/product.model';
import { ProductClient } from '@libs/client/Product';
import { Pagination, Space, Tag, Typography } from 'antd';
import Link from 'next/link';
import ProductCard from '@components/templates/ProductCard';
import WithPagination from '@configs/types/utils/with-pagination';
import { useRouter } from 'next/router';

const SearchPage: NextPageWithLayout<{
  searchedProducts?: WithPagination<Product[]>;
}> = ({ searchedProducts }) => {
  const router = useRouter();

  return (
    <div className="mx-auto  px-4 pb-8 lg:container lg:px-0">
      <Typography.Title level={1} className="mt-8 font-medium">
        {router.query['tu-khoa'] ? (
          <>
            Tìm thấy <b>{searchedProducts?.total || 0}</b> sản phẩm
          </>
        ) : (
          <>Các sản phẩm phổ biến</>
        )}
      </Typography.Title>

      <div className="mt-4">
        <Typography.Title
          level={4}
          className="mb-1 font-normal text-neutral-600"
        >
          Cụm từ khóa nổi bật
        </Typography.Title>
        <Space size={[8, 8]} wrap>
          {[
            'Thuốc đau đầu',
            'Thuốc đau bụng',
            'Thuốc đau mắt',
            'Thuốc xương khớp',
          ].map((tag) => (
            <Link href={`/tim-kiem?tu-khoa=${tag}`} key={tag}>
              <Tag className="cursor-pointer rounded-full border-none bg-primary-background p-2 text-base">
                {tag}
              </Tag>
            </Link>
          ))}
        </Space>
      </div>

      {(searchedProducts?.total || 0) > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {searchedProducts?.data.map((product) => (
              <div key={product.key}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <Pagination
          defaultCurrent={searchedProducts?.page}
          pageSize={20}
          onChange={(page) => {
            router.replace({
              pathname: '/tim-kiem',
              query: {
                ...router.query,
                trang: page,
              },
            });
          }}
          total={searchedProducts?.total}
          className="mt-4"
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default SearchPage;

SearchPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
      searchedProducts?: WithPagination<Product[]>;
    };
  } = {
    props: {
      searchedProducts: undefined,
    },
  };

  const query = context.query['tu-khoa'] as string;
  const page = context.query['trang'] as string;
  const pageSize = context.query['so-luong'] as string;

  const product = new ProductClient(null, {});
  const searchProducts = await product.getProducts({
    page: page ? parseInt(page) : 1,
    pageSize: pageSize ? parseInt(pageSize) : 20,
    isPrescripted: false,
    filterByName: query,
  });

  if (searchProducts.data) {
    serverSideProps.props.searchedProducts = searchProducts.data;
  }

  return serverSideProps;
};
