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
import { useAppData } from '@providers/AppDataProvider';
import { useEffect } from 'react';
import { GeneralClient } from '@libs/client/General';
import ProductSearchKeyword from '@configs/models/product-search-keyword.model';

const SearchPage: NextPageWithLayout<{
  searchedProducts?: WithPagination<Product[]>;
  productSearchKeywords?: ProductSearchKeyword[];
}> = ({ searchedProducts, productSearchKeywords }) => {
  const router = useRouter();
  const { setProductSearchKeywords } = useAppData();

  useEffect(() => {
    setProductSearchKeywords(productSearchKeywords || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto  px-4 pb-8 lg:container lg:px-0">
      <Typography.Title
        level={1}
        className="mt-4 mb-0 text-2xl font-medium md:mt-8 md:text-4xl"
      >
        {router.query['tu-khoa'] ? (
          <>
            Tìm thấy <b>{searchedProducts?.total || 0}</b> sản phẩm
          </>
        ) : (
          <>Các sản phẩm phổ biến</>
        )}
      </Typography.Title>

      <div className="mt-2 md:mt-4">
        <Typography.Title
          level={4}
          className="mb-1 text-lg font-normal text-neutral-600 md:text-xl"
        >
          Cụm từ khóa phổ biến
        </Typography.Title>
        <Space size={[0, 0]} wrap>
          {productSearchKeywords?.map((keyword) => (
            <Link
              href={`/tim-kiem?tu-khoa=${keyword.keyword}`}
              key={keyword.keyword}
            >
              <Tag className="cursor-pointer rounded-full border-none bg-primary-background p-2 text-sm md:text-base">
                {keyword.keyword}
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

      {(searchedProducts?.total || 0) > 0 && (
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
      )}
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
      productSearchKeywords: ProductSearchKeyword[];
    };
  } = {
    props: {
      searchedProducts: undefined,
      productSearchKeywords: [],
    },
  };

  const query = context.query['tu-khoa'] as string;
  const page = context.query['trang'] as string;
  const pageSize = context.query['so-luong'] as string;

  try {
    const productClient = new ProductClient(context, {});
    const generalClient = new GeneralClient(context, {});
    const [searchProducts, productSearchKeywords] = await Promise.all([
      productClient.getProducts({
        page: page ? parseInt(page) : 1,
        pageSize: pageSize ? parseInt(pageSize) : 20,
        isPrescripted: false,
        filterByName: query,
      }),
      generalClient.getProductSearchKeywords(),
    ]);

    if (searchProducts.data) {
      serverSideProps.props.searchedProducts = searchProducts.data;
    }

    if (productSearchKeywords.data) {
      serverSideProps.props.productSearchKeywords = productSearchKeywords.data;
    }
  } catch (error) {
    console.error('file: tim-kiem.tsx:141 | error:', error);
  }

  return serverSideProps;
};
