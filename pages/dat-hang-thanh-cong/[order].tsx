import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Breadcrumb, Button, Radio, Result, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import Link from 'next/link';
import { ChevronLeft } from 'react-feather';
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import OrderModel from '@configs/models/order.model';
import { OrderClient } from '@libs/client/Order';
import ImageWithFallback from '@components/templates/ImageWithFallback';

const OrderPage: NextPageWithLayout = ({ order }: { order?: OrderModel }) => {
  return (
    <div className="container max-w-[720px] pb-4">
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
      </Breadcrumb>

      <div className="md:border-1 border-none px-4 py-0 shadow-none md:rounded-lg md:border-solid md:border-gray-200 md:py-4 md:shadow-lg">
        <Result
          status="success"
          title="Đơn hàng của bạn đã được đặt thành công!"
          subTitle={
            <>
              <Typography className="text-center">
                Mã đơn hàng: #<b>{order?.key}</b>. Chúng tôi sẽ xử lý đơn hàng
                và giao cho bạn trong thời gian sớm nhất.
              </Typography>

              <div className="mt-4 rounded-xl bg-primary-background p-4">
                <Typography className="text-left">
                  <span className="text-gray-600">Khách hàng:</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Typography.Text className="font-medium">
                    {order?.receiverName}, {order?.receiverTel}
                  </Typography.Text>
                </Typography>
                {order?.deliveryDetail && (
                  <Typography className="text-left">
                    <span className="text-gray-600">Địa chỉ nhận hàng:</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Typography.Text className="font-medium">
                      {order?.deliveryDetail}, {order?.deliveryWard},{' '}
                      {order?.deliveryDistrict}, {order?.deliveryProvince}
                    </Typography.Text>
                  </Typography>
                )}
                {order?.drugstore?.key && (
                  <Typography className="text-left">
                    <span className="text-gray-600">Nhận tại nhà thuốc:</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Typography.Text className="font-medium">
                      {order?.drugstore.name}, {order?.drugstore.address}
                    </Typography.Text>
                  </Typography>
                )}
                <Typography className="text-left">
                  <span className="text-gray-600">Tổng tiền:</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="font-bold text-primary">
                    {order?.totalAmount?.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </span>
                </Typography>
              </div>

              <div className="mt-8">
                <Typography className="text-left">
                  <Typography className="text-gray-600">
                    Hình thức thanh toán:
                  </Typography>
                  <Radio className="my-2 w-full" checked>
                    <div className="flex items-center">
                      <ImageWithFallback
                        src={order?.paymentMethod?.image || ''}
                        width={40}
                        height={40}
                        layout="fixed"
                        getMockImage={() => '/mock/checkout.png'}
                      />
                      <div className="ml-2">
                        <Typography className="font-medium">
                          {order?.paymentMethod?.name}
                        </Typography>
                        <Typography>
                          {order?.paymentMethod?.description}
                        </Typography>
                      </div>
                    </div>
                  </Radio>
                </Typography>
              </div>
            </>
          }
          extra={[
            <Link href="/" key={1}>
              <Button type="primary" className="shadow-none">
                Xác nhận và quay lại
              </Button>
            </Link>,
          ]}
        />
      </div>
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
