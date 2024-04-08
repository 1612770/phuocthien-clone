import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from '../page';
import { Breadcrumb, Empty, Pagination, Tabs, Typography } from 'antd';
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
import OrderStatuses from '@configs/enums/order-statuses.enum';
import OrderStatusUtils from '@libs/utils/order-status.utils';

const OrdersPage: NextPageWithLayout<{
  orders?: WithPagination<OrderModel[]>;
}> = ({ orders }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen min-w-full bg-primary-background">
      <div className="container grid pt-2">
        <Breadcrumb className="mt-2 mb-2">
          <Breadcrumb.Item>
            <span onClick={() => router.push('/')} className="cursor-pointer">
              <div className="flex items-center">
                <ChevronLeft size={14} />
                <span>Trang chủ</span>
              </div>
            </span>
          </Breadcrumb.Item>
        </Breadcrumb>

        <UserLayout>
          <Tabs
            className="px-2"
            defaultActiveKey={
              router.query['trang-thai']
                ? String(router.query['trang-thai'])
                : String(OrderStatuses.WAIT_FOR_CONFIRM)
            }
            items={[
              OrderStatuses.WAIT_FOR_CONFIRM,
              OrderStatuses.PROCESSING,
              OrderStatuses.SHIPPING,
              OrderStatuses.COMPLETED,
              OrderStatuses.CANCELLED,
            ].map((status) => ({
              key: String(status),
              label: OrderStatusUtils.formatOrderStatus(status).label,
              children: (
                <>
                  {orders?.data?.map((order) => (
                    <OrderItem order={order} key={order.key} />
                  ))}

                  {!orders?.total && (
                    <Empty
                      className="mt-8"
                      description={
                        <Typography>Bạn chưa có đơn hàng nào ở đây</Typography>
                      }
                    ></Empty>
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
                </>
              ),
            }))}
            onChange={(value) => {
              router.push({
                query: {
                  ...router.query,
                  trang: 1,
                  ['trang-thai']: value,
                },
              });
            }}
          />
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
      status: context.query['trang-thai']
        ? (+context.query['trang-thai'] as OrderStatuses)
        : OrderStatuses.WAIT_FOR_CONFIRM,
    });

    if (ordersResponse?.data) {
      serverSideProps.props.orders = ordersResponse.data;
    }
  } catch (error) {
    console.error('file: index.tsx:130 | error:', error);
  }

  return serverSideProps;
};
