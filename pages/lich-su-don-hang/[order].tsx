import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Breadcrumb, Divider, Tag, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import Link from 'next/link';
import {
  ChevronLeft,
  Clock,
  DollarSign,
  ShoppingBag,
  User,
} from 'react-feather';
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import OrderModel from '@configs/models/order.model';
import { OrderClient } from '@libs/client/Order';
import UserLayout from '@components/layouts/UserLayout';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';
import TimeUtils from '@libs/utils/time.utils';
import OrderStatusUtils from '@libs/utils/order-status.utils';
import LinkWrapper from '@components/templates/LinkWrapper';

const OrderPage: NextPageWithLayout<{ order?: OrderModel }> = ({ order }) => {
  return (
    <div className="container px-2 pb-4 lg:px-0">
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
          <Tag
            color={OrderStatusUtils.formatOrderStatus(order?.status).tagColor}
            className="mb-2 shadow-none"
          >
            {OrderStatusUtils.formatOrderStatus(order?.status).label}
          </Tag>{' '}
          <Typography.Title
            level={5}
            className="m-0 inline-block align-middle font-medium"
          >
            #{order?.code}
            <Typography.Text className="font-normal text-gray-600"></Typography.Text>
          </Typography.Title>
          <Typography.Paragraph className="m-0 mb-4 text-gray-600">
            <Clock size={16} className=" align-text-top" /> Ngày đặt &nbsp;
            <Typography.Text className="font-medium">
              {TimeUtils.formatDate(order?.createdTime, {})}
            </Typography.Text>
          </Typography.Paragraph>
        </Typography>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_minmax(200px,_300px)] md:gap-4">
          <div className="rounded-lg border border-solid border-gray-200 bg-white p-4">
            <div className="mb-2 flex items-center">
              <User size={20} className="text-primary" />
              &nbsp;
              <Typography className="text-lg">Thông tin người nhận</Typography>
            </div>
            <Typography className="mb-2 text-left">
              <Typography.Text className="text-base font-medium">
                {order?.receiverName}
              </Typography.Text>
            </Typography>
            <Typography className="text-left text-gray-800">
              {order?.receiverTel}
            </Typography>
            {order?.deliveryDetail && (
              <Typography className="text-left text-gray-800">
                {order?.deliveryDetail}, {order?.deliveryWard},{' '}
                {order?.deliveryDistrict}, {order?.deliveryProvince}
              </Typography>
            )}
            {order?.drugstore?.key && (
              <Typography className="text-left text-gray-800">
                {order?.drugstore.name}, {order?.drugstore.address}
              </Typography>
            )}
          </div>

          <div className="rounded-lg border border-solid border-gray-200 bg-white p-4">
            <div className="mb-2 flex items-center">
              <DollarSign size={20} className="text-primary" />
              &nbsp;
              <Typography className="text-lg">Hình thức thanh toán</Typography>
            </div>
            <ImageWithFallback
              src={order?.paymentMethod?.image || ''}
              width={60}
              height={60}
            ></ImageWithFallback>
            <Typography className="text-left">
              <Typography.Text className="">
                {order?.paymentMethod?.name}
              </Typography.Text>
            </Typography>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-solid border-gray-200 bg-white py-4">
          <div className="mb-2 flex items-center px-4">
            <ShoppingBag size={20} className="text-primary" />
            &nbsp;
            <Typography className="text-lg">Thông tin sản phẩm</Typography>
          </div>

          <div className="divide-y divide-x-0 divide-solid divide-gray-200">
            {order?.details?.map((detail) => (
              <LinkWrapper
                href={`/san-pham/chi-tiet/${detail.productKey}`}
                key={detail.key}
              >
                <div
                  className={`flex flex-col justify-start px-4 py-4 transition-all duration-200 ease-in-out hover:bg-gray-100 sm:flex-row sm:justify-between`}
                >
                  <div className="mr-4 flex flex-col items-start sm:items-center">
                    <div className="relative flex h-[60px] w-[60px] flex-col">
                      <ImageWithFallback
                        src={detail.imageUrl || ''}
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
                      <Typography.Text className="font-medium">
                        {detail.productName}
                      </Typography.Text>

                      {detail.note && (
                        <Typography.Text className="text-sm text-gray-600">
                          {detail.note}
                        </Typography.Text>
                      )}

                      <Typography.Text className="text-sm text-gray-500">
                        Số lượng:&nbsp;&nbsp;
                        <Typography.Text className="">
                          {detail.quantity} {detail.unit}
                        </Typography.Text>
                      </Typography.Text>

                      {detail.note && (
                        <Typography.Text className="text-sm text-gray-500">
                          Ghi chú:&nbsp;&nbsp;
                          <Typography.Text className="">
                            {detail.note}
                          </Typography.Text>
                        </Typography.Text>
                      )}
                    </div>

                    <div className="meta flex flex-col">
                      <Typography.Text className="text-right">
                        <Typography.Text className="text-sm">
                          {detail.price?.toLocaleString('it-IT', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </Typography.Text>
                        {detail.unit && (
                          <Typography.Text className="text-sm">
                            &nbsp;/&nbsp;{detail.unit}
                          </Typography.Text>
                        )}
                      </Typography.Text>
                      <Typography.Text className="text-sm text-gray-500">
                        Tạm tính:&nbsp;&nbsp;
                        <Typography.Text className="">
                          {detail.totalAmount?.toLocaleString('it-IT', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </Typography.Text>
                      </Typography.Text>
                    </div>
                  </div>
                </div>
              </LinkWrapper>
            ))}
          </div>
        </div>
        <div className="mr-0 ml-auto w-full px-0 py-4 md:w-[400px] md:px-2">
          {order?.subTotalAmount != order?.totalAmount && (
            <div className="my-2 flex items-end justify-between px-2">
              <Typography.Text className="text-right  text-base text-gray-500">
                Tạm tính
              </Typography.Text>
              <Typography.Text className="m-0 text-base font-medium ">
                {order?.subTotalAmount?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography.Text>
            </div>
          )}
          {order?.offerCode && (
            <div className="my-2 flex items-end justify-between px-2 ">
              <Typography.Text className="text-right text-base text-gray-500">
                Mã ưu đãi
              </Typography.Text>
              <Typography.Text className="m-0 text-base font-medium ">
                {order?.offerCode}
              </Typography.Text>
            </div>
          )}
          {order?.subTotalAmount != order?.totalAmount && order?.offerCode && (
            <Divider className="mt-4 mb-0" />
          )}
          <div className="my-2 flex items-end justify-between px-2 ">
            <Typography.Text className="text-right text-base text-gray-500">
              Tổng tiền
            </Typography.Text>
            <Typography.Text className="m-0 text-3xl font-bold text-primary">
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
