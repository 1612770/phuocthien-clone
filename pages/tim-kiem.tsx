import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Product from '@configs/models/product.model';
import { ProductClient } from '@libs/client/Product';
import { Col, Row, Space, Tag, Typography } from 'antd';
import Link from 'next/link';
import ProductCard from '@components/templates/ProductCard';

const SearchPage: NextPageWithLayout<{
  searchedProducts: Product[];
}> = ({ searchedProducts }) => {
  return (
    <div className="mx-auto  pb-8 lg:container">
      <Typography.Title level={1} className="mt-8">
        Tìm thấy {searchedProducts.length} sản phẩm
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

      {searchedProducts.length > 0 && (
        <div className="mt-4">
          <Typography.Title
            level={4}
            className="mb-1 font-normal text-neutral-600"
          >
            Tìm thấy {searchedProducts.length} kết quả
          </Typography.Title>

          <Row gutter={[8, 8]} className="w-full">
            {searchedProducts.map((product) => (
              <Col
                sm={24}
                md={12}
                lg={8}
                xl={6}
                className="w-full"
                key={product.key}
              >
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

SearchPage.getLayout = (page) => {
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
      searchedProducts: Product[];
    };
  } = {
    props: {
      searchedProducts: [],
    },
  };

  const query = context.query['tu-khoa'] as string;
  const page = context.query['trang'] as string;
  const pageSize = context.query['so-luong'] as string;

  const product = new ProductClient(null, {});
  const searchProducts = await product.getProducts({
    page: page ? parseInt(page) : 1,
    pageSize: pageSize ? parseInt(pageSize) : 10,
    isPrescripted: false,
    filterByName: query,
  });

  if (searchProducts.data?.data) {
    serverSideProps.props.searchedProducts = searchProducts.data?.data || [];
  }

  return serverSideProps;
};
