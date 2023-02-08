import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import ProductCard from 'components/templates/ProductCard';
import { NextPageWithLayout } from './page';
import { Col, Row, Typography } from 'antd';
import { GetServerSidePropsContext } from 'next';
import { ProductClient } from '@libs/client/Product';
import MenuModel from '@configs/models/menu.model';
import Product from '@configs/models/product.model';
import { Fragment } from 'react';
import HomepageCarousel from '@modules/homepage/HomepageCarousel';
import HomepageSearchSection from '@modules/homepage/HomepageSearchSection';

const Home: NextPageWithLayout<{
  featureProductsLists: { products: Product[]; productType: MenuModel }[];
}> = ({ featureProductsLists }) => {
  return (
    <div className='mb-8'>
      <HomepageCarousel />

      <div className="-mt-20 hidden lg:block">
        <HomepageSearchSection />
      </div>

      {featureProductsLists.map((featureProductsList, index) =>
        featureProductsList.products?.length ? (
          <Fragment key={index}>
            <div className="pl-2 lg:container lg:pl-0">
              <Typography.Title
                level={3}
                className="mb-0 mt-6 uppercase lg:mb-4 lg:mt-12"
              >
                {featureProductsList.productType?.name}
              </Typography.Title>
            </div>
            <div className="lg:container">
              <Row gutter={[16, 16]} className="hidden lg:flex">
                {featureProductsList.products.map((product, index) => (
                  <Col sm={24} md={12} lg={6} className="w-full" key={index}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
              <div className="-mx-2 flex w-full overflow-auto pl-2 lg:hidden">
                {featureProductsList.products.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    className="m-2 min-w-[240px] max-w-[240px]"
                  />
                ))}
              </div>
            </div>
          </Fragment>
        ) : null
      )}
    </div>
  );
};

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

// get server side props
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
      featureProductsLists: { products: Product[]; productType: MenuModel }[];
    };
  } = {
    props: {
      featureProductsLists: [],
    },
  };

  const productClient = new ProductClient(context, {});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((context.req as any)._fromAppData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { fullMenu }: { fullMenu: MenuModel[] } = (context.req as any)
      ._fromAppData;

    // get first 3 menu keys
    const featureProductTypes = fullMenu.slice(0, 3);

    try {
      const featureProductsLists = await Promise.all(
        featureProductTypes.map((featureProductType) =>
          productClient.getProducts({
            page: 1,
            pageSize: 10,
            isPrescripted: false,
            productTypeKey: featureProductType?.key,
          })
        )
      );

      serverSideProps.props.featureProductsLists = featureProductsLists.map(
        (featureProductsLists, index) => ({
          products: featureProductsLists.data?.data || [],
          productType: featureProductTypes[index],
        })
      );
    } catch (error) {
      console.log('file: index.tsx:181 | error', error);
    }
  }

  return serverSideProps;
};
