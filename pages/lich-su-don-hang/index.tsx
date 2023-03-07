import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from '../page';
import { Breadcrumb, Button, Empty, Pagination, Typography } from 'antd';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { COOKIE_KEYS } from '@libs/helpers';
import OrdersProvider from '@providers/OrdersProvider';
import Link from 'next/link';
import { ChevronLeft } from 'react-feather';
import OrderItem from '@modules/orders/OrderItem';
import UserLayout from '@components/layouts/UserLayout';
import { OrderClient } from '@libs/client/Order';
import OrderModel from '@configs/models/order.model';
import WithPagination from '@configs/types/utils/with-pagination';
import { useRouter } from 'next/router';

const OrdersPage: NextPageWithLayout<{
  orders?: WithPagination<OrderModel[]>;
}> = ({ orders }) => {
  const router = useRouter();

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
          {orders?.data?.map((order) => (
            <OrderItem order={order} key={order.key} />
          ))}

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

          {!!orders?.total && (
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
          )}
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
  const serverSideProps: {
    props: {
      orders?: WithPagination<OrderModel[]>;
    };
  } = {
    props: {},
  };

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

  try {
    const orderClient = new OrderClient(context, {});
    const ordersResponse = await orderClient.getOrders({
      page: +(context.query.trang || 1),
      pageSize: 10,
    });

    if (ordersResponse?.data) {
      serverSideProps.props.orders = ordersResponse.data;
    }
  } catch (error) {
    console.error('file: index.tsx:130 | error:', error);
  }

  return serverSideProps;
};
