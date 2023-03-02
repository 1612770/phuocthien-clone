import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from '../page';
import { Breadcrumb, Button, Empty, Pagination, Spin, Typography } from 'antd';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { COOKIE_KEYS } from '@libs/helpers';
import OrdersProvider, { useOrders } from '@providers/OrdersProvider';
import { useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'react-feather';
import OrderItem from '@modules/orders/OrderItem';
import UserLayout from '@components/layouts/UserLayout';
import { useRouter } from 'next/router';

const OrdersPage: NextPageWithLayout = () => {
  const { orders, gettingOrders, getOrders } = useOrders();
  const router = useRouter();

  useEffect(() => {
    getOrders({
      page: +(router.query.trang || 1),
    });
  }, [router.query.trang]);

  return (
    <div className="min-h-screen min-w-full bg-primary-background">
      <div className="container grid pt-4">
        <Breadcrumb className="mb-2 px-2">
          <Breadcrumb.Item>
            <Link href="/">
              <a>
                <div className="flex items-center">
                  <ChevronLeft size={14} />
                  <span>Trang chủ</span>
                </div>
              </a>
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>

        <UserLayout>
          <Spin spinning={gettingOrders}>
            {orders?.data?.map((order) => (
              <OrderItem order={order} key={order.key} />
            ))}
          </Spin>

          {!orders?.total && (
            <Empty
              className="mt-8"
              description={
                <Typography>Bạn chưa có đơn hàng nào ở đây</Typography>
              }
            >
              <Link href="/gio-hang">
                <a>
                  <Button>Tiến hành thanh toán</Button>
                </a>
              </Link>
            </Empty>
          )}

          <div className="flex justify-center">
            <Pagination
              defaultCurrent={+(router.query.trang || 1)}
              pageSize={10}
              onChange={(page) => {
                router.push({
                  query: {
                    ...router.query,
                    trang: page,
                  },
                });
              }}
              total={orders?.total}
              className="mt-4"
              showSizeChanger={false}
            />
          </div>
        </UserLayout>
      </div>
    </div>
  );
};

export default OrdersPage;

OrdersPage.getLayout = (page) => {
  return (
    <OrdersProvider>
      <PrimaryLayout>{page}</PrimaryLayout>
    </OrdersProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // check cookie in request
  const { req } = context;
  const token = req.cookies[COOKIE_KEYS.TOKEN];
  if (!token) {
    return {
      redirect: {
        destination: '/dang-nhap',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
