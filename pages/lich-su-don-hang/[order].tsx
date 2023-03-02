import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Breadcrumb, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import Link from 'next/link';
import { ChevronLeft, DollarSign, ShoppingBag, User } from 'react-feather';
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import OrderModel from '@configs/models/order.model';
import { OrderClient } from '@libs/client/Order';
import UserLayout from '@components/layouts/UserLayout';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';
import TimeUtils from '@libs/utils/time.utils';
import OrderStatusUtils from '@libs/utils/order-status.utils';

const OrderPage: NextPageWithLayout<{ order?: OrderModel }> = ({ order }) => {
  return (
    <div className="container pb-4">
      <Breadcrumb className="mt-4 mb-2">
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
        <Breadcrumb.Item>
          <Link href="/lich-su-don-hang">
            <a>
              <span>Lịch sử đơn hàng</span>
            </a>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <UserLayout>
        <Typography>
          <Typography.Title level={5} className="m-0 mb-2 font-medium">
            Đơn hàng #{order?.key}
            <Typography.Text className="font-normal text-gray-600"></Typography.Text>
          </Typography.Title>

          <Typography.Paragraph className="m-0 text-gray-600">
            Ngày đặt:{' '}
            <Typography.Text className="font-medium">
              {TimeUtils.formatDate(order?.createdTime, {})}
            </Typography.Text>
          </Typography.Paragraph>
          <Typography.Paragraph className="text-gray-600">
            Trạng thái:{' '}
            <Typography.Text className="font-medium ">
              {OrderStatusUtils.formatOrderStatus(order?.status).label}
            </Typography.Text>
          </Typography.Paragraph>
        </Typography>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
          <div className="rounded-lg border border-solid border-gray-200 bg-white p-4">
            <div className="mb-2 flex items-center">
              <User size={20} className="text-primary" />
              &nbsp;
              <Typography className="text-lg">Thông tin người nhận</Typography>
            </div>
            <Typography className="text-left">
              <span className="inline-block min-w-[72px] text-gray-600">
                Họ tên:
              </span>
              &nbsp;&nbsp;&nbsp;
              <Typography.Text className="font-medium">
                {order?.receiverName}
              </Typography.Text>
            </Typography>
            <Typography className="text-left">
              <span className="inline-block min-w-[72px] text-gray-600">
                Điện thoại:
              </span>
              &nbsp;&nbsp;&nbsp;
              <Typography.Text className="font-medium">
                {order?.receiverTel}
              </Typography.Text>
            </Typography>
            {order?.deliveryDetail && (
              <Typography className="text-left">
                <span className="inline-block min-w-[72px] text-gray-600">
                  Địa chỉ:
                </span>
                &nbsp;&nbsp;&nbsp;
                <Typography.Text className="font-medium">
                  {order?.deliveryDetail}, {order?.deliveryWard},{' '}
                  {order?.deliveryDistrict}, {order?.deliveryProvince}
                </Typography.Text>
              </Typography>
            )}
            {order?.drugstore?.key && (
              <Typography className="text-left">
                <span className="inline-block min-w-[72px] text-gray-600">
                  Nhà thuốc:
                </span>
                &nbsp;&nbsp;&nbsp;
                <Typography.Text className="font-medium">
                  {order?.drugstore.name}, {order?.drugstore.address}
                </Typography.Text>
              </Typography>
            )}
          </div>

          <div className="rounded-lg border border-solid border-gray-200 bg-white p-4">
            <div className="mb-2 flex items-center">
              <DollarSign size={20} className="text-primary" />
              &nbsp;
              <Typography className="text-lg">Hình thức thanh toán</Typography>
            </div>
            <Typography className="text-left">
              <Typography.Text className="font-medium">
                {order?.paymentMethod?.name}
              </Typography.Text>
            </Typography>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-solid border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center">
            <ShoppingBag size={20} className="text-primary" />
            &nbsp;
            <Typography className="text-lg">Thông tin sản phẩm</Typography>
          </div>

          <div className="divide-y divide-x-0 divide-solid divide-gray-200">
            {order?.details?.map((detail) => (
              <div className={`flex justify-between py-4  `} key={detail.key}>
                <div className="mr-4 flex flex-col items-center ">
                  <div className="relative flex h-[60px] w-[60px] flex-col">
                    <ImageWithFallback
                      src={''}
                      alt="product image"
                      getMockImage={() => {
                        return ImageUtils.getRandomMockProductImageUrl();
                      }}
                      layout="fill"
                    />
                  </div>
                </div>
                <div className="flex flex-grow flex-wrap gap-2">
                  <div className="flex flex-grow basis-[300px] flex-col items-start">
                    <Typography.Text className="">
                      {detail.productName}
                    </Typography.Text>

                    {detail.note && (
                      <Typography.Text className="text-sm text-gray-600">
                        {detail.note}
                      </Typography.Text>
                    )}

                    <Typography.Text className="text-sm text-gray-600">
                      Số lượng:&nbsp;&nbsp;
                      <Typography.Text className="font-medium">
                        {detail.quantity}
                      </Typography.Text>
                    </Typography.Text>

                    <Typography.Text className="text-sm text-gray-600">
                      Tạm tính:&nbsp;&nbsp;
                      <Typography.Text className="font-medium">
                        {detail.totalAmount?.toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </Typography.Text>
                    </Typography.Text>
                  </div>
                  <div className="meta flex flex-col">
                    <Typography.Text className="text-right">
                      <Typography.Text className="text-sm font-semibold">
                        {detail.price?.toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </Typography.Text>
                      {detail.unit && (
                        <Typography.Text className="text-sm">
                          /{detail.unit}
                        </Typography.Text>
                      )}
                    </Typography.Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <div className="mt-4">
            <Typography.Text className="text-right text-base text-gray-600">
              Tổng tiền:&nbsp;
            </Typography.Text>
            <Typography.Text className="m-0 text-3xl font-semibold text-primary">
              {order?.totalAmount?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              })}
            </Typography.Text>
          </div>
        </div>
      </UserLayout>
    </div>
  );
};

export default OrderPage;

OrderPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

// get server side props
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
      order?: OrderModel;
    };
  } = {
    props: {},
  };

  const order = new OrderClient(context, {});
  const orderResponse = await order.getOrder({
    key: context.params?.['order'] as string,
  });

  if (orderResponse.data) {
    serverSideProps.props.order = orderResponse.data;
  }

  return serverSideProps;
};
