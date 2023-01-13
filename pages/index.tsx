import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import ProductCard from 'components/templates/ProductCard';
import { NextPageWithLayout } from './page';
import { Col, Row, Typography } from 'antd';
import { GetServerSidePropsContext } from 'next';
import { ProductClient } from '@libs/client/Product';
import MenuModel from '@configs/models/menu.model';
import Product from '@configs/models/product.model';
import { Fragment } from 'react';
import UrlUtils from '@libs/utils/url.utils';
import HomepageCarousel from '@modules/homepage/HomepageCarousel';
import HomepageSearch from '@modules/homepage/HomepageSearch';

const Home: NextPageWithLayout<{
  featureProductsLists: { products: Product[]; productType: MenuModel }[];
}> = ({ featureProductsLists }) => {
  return (
    <>
      <HomepageCarousel />

      <div className="-mt-20 hidden lg:block">
        <HomepageSearch />
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
                    <ProductCard
                      href={`/${UrlUtils.generateSlug(
                        product.productType?.name,
                        product.productType?.key
                      )}/${UrlUtils.generateSlug(
                        product.productGroup?.name,
                        product.productGroup?.key
                      )}/${UrlUtils.generateSlug(product?.name, product?.key)}`}
                      product={product}
                    />
                  </Col>
                ))}
              </Row>
              <div className="-mx-2 flex w-full overflow-auto pl-2 lg:hidden">
                {featureProductsList.products.map((product, index) => (
                  <ProductCard
                    href={`/${UrlUtils.generateSlug(
                      product.productType?.name,
                      product.productType?.key
                    )}/${UrlUtils.generateSlug(
                      product.productGroup?.name,
                      product.productGroup?.key
                    )}/${UrlUtils.generateSlug(product?.name, product?.key)}`}
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

      {/* <img
        className="mt-8 mb-2 block aspect-video max-h-[240px] w-full object-cover"
        src="https://phuocthien.vn/Images/ImageUpload/2022-11/TOCDE.png"
        alt="banner image"
      />
      <div className="lg:container">
        <div className="flex overflow-auto px-2 pb-2 lg:justify-center">
          <Space size={[16, 8]} wrap className="justify-center">
            <Button size="large" className="border-none bg-gray-100">
              Nổi bật
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Giảm đau, hạ sốt
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Thuốc ho
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Mắt, tai, mũi, họng
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Mắt, tai, mũi, họng
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Mắt, tai, mũi, họng
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Mắt, tai, mũi, họng
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Mắt, tai, mũi, họng
            </Button>
            <Button size="large" className="border-none bg-gray-100">
              Mắt, tai, mũi, họng
            </Button>
          </Space>
        </div>

        <Row gutter={16} className="hidden lg:flex">
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Hỗn dịch uống Phosphalugel 20% trị trào ngược dạ dày, thực quản" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Khẩu trang y tế Khánh An 4 lớp màu trắng" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Nước muối Safin giúp sát khuẩn, súc miệng" />
          </Col>
          <Col sm={24} md={12} lg={6} className="w-full">
            <ProductCard title="Cao dán Salonpas giảm đau, kháng viêm" />
          </Col>
        </Row>
        <div className="-mx-2 flex w-full overflow-auto pl-2 lg:hidden">
          <ProductCard
            title="Hỗn dịch uống Phosphalugel 20% trị trào ngược dạ dày, thực quản"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Khẩu trang y tế Khánh An 4 lớp màu trắng"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Nước muối Safin giúp sát khuẩn, súc miệng"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
          <ProductCard
            title="Cao dán Salonpas giảm đau, kháng viêm"
            className="m-2 min-w-[240px] max-w-[240px]"
          />
        </div>

        <div className="mt-2 flex justify-center">
          <Button size="large" className="w-1/2 border-primary text-primary">
            Xem tất cả thuốc
            <ChevronRight size={16} className="align-middle" />
          </Button>
        </div>
      </div> */}
    </>
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
