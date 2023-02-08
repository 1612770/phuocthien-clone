import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { NextPageWithLayout } from '../page';
import {
  Breadcrumb,
  Button,
  Divider,
  Empty,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { COOKIE_KEYS } from '@libs/helpers';
import OrdersProvider, { useOrders } from '@providers/OrdersProvider';
import { useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'react-feather';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';
import OrderStatusUtils from '@libs/utils/order-status.utils';
import TimeUtils from '@libs/utils/time.utils';

const OrdersPage: NextPageWithLayout = () => {
  const { orders, gettingOrders, getOrders } = useOrders();
  console.log('file: index.tsx:13 | orders', orders);

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="min-h-screen min-w-full bg-primary-background">
      <div className="m-auto max-w-[720px] pt-4">
        <div>
          <Breadcrumb className="mb-2">
            <Breadcrumb.Item>
              <Link href="/">
                <a>
                  <div className="flex items-center">
                    <ChevronLeft size={20} />
                    <span>Trang chủ</span>
                  </div>
                </a>
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>

          <Spin spinning={gettingOrders}>
            {orders?.data?.map((order) => (
              <Link href={`/lich-su-don-hang/${order.key}`} key={order.key}>
                <div className=" mb-4 rounded-none bg-white p-4 sm:rounded-lg sm:p-8">
                  <div className="flex flex-wrap gap-0 sm:gap-2">
                    <div className="flex">
                      <Typography className=" whitespace-nowrap">
                        Mã đơn hàng:
                      </Typography>
                      <Typography.Text className="ml-2 whitespace-pre-wrap font-medium">
                        #{order.key}
                      </Typography.Text>
                    </div>

                    <div className="flex">
                      <Typography>Thời gian đặt:</Typography>
                      <Typography className="ml-2 font-medium">
                        {TimeUtils.formatDate(order.createdTime)}
                      </Typography>
                    </div>
                  </div>

                  <Divider className="my-4" />

                  <div className="flex gap-1 sm:gap-2">
                    <div
                      className={`relative mr-4 h-[60px] min-w-[60px] overflow-hidden rounded-lg border border-solid border-gray-200 bg-gray-100`}
                    >
                      <ImageWithFallback
                        src={order.image || ''}
                        layout="fill"
                        objectFit="cover"
                        loading="lazy"
                        getMockImage={() =>
                          ImageUtils.getRandomMockProductImageUrl()
                        }
                      />
                    </div>

                    <div className="flex flex-1 flex-col items-start justify-between sm:flex-row sm:items-center">
                      <div className="flex items-center">
                        <div className="flex flex-col">
                          <Typography className="font-medium">
                            {order.details?.[0].productName}
                          </Typography>
                          <Typography className="text-gray-500">
                            {order.details?.[0].quantity}{' '}
                            {order.details?.[0].unit}
                          </Typography>
                          {(order.details?.length || 0) > 1 && (
                            <Tooltip
                              placement="bottom"
                              title={order.details?.slice(1).map((detail) => (
                                <div key={detail.key} className="my-0.5 px-2">
                                  <Typography className="text-white">
                                    {detail.productName}
                                  </Typography>
                                  <Typography className="text-xs text-gray-300">
                                    {detail.quantity} {detail.unit}
                                  </Typography>
                                </div>
                              ))}
                            >
                              <Typography className="text-blue-500">
                                Và {(order.details?.length || 0) - 1} sản phẩm
                                khác
                              </Typography>
                            </Tooltip>
                          )}

                          <div className="flex items-center gap-2">
                            <Tag
                              color={
                                OrderStatusUtils.formatOrderStatus(order.status)
                                  .tagColor
                              }
                              className="mt-2  shadow-none"
                            >
                              {
                                OrderStatusUtils.formatOrderStatus(order.status)
                                  .label
                              }
                            </Tag>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-0">
                        <Typography className="text-left sm:text-right">
                          Tổng tiền:
                        </Typography>
                        <Typography className="text-left text-lg font-medium sm:text-right">
                          {order.totalAmount?.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </Typography>

                        <Link href={`/lich-su-don-hang/${order.key}`}>
                          <Button
                            ghost
                            size="small"
                            type="primary"
                            className="mt-2 hidden sm:block"
                          >
                            Xem chi tiết
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
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
        </div>
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
