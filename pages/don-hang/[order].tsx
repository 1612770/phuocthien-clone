import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { Breadcrumb, Button, Result, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import Link from 'next/link';
import { ChevronLeft } from 'react-feather';
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import OrderModel from '@configs/models/order.model';
import { OrderClient } from '@libs/client/Order';

const OrderPage: NextPageWithLayout = ({ order }: { order?: OrderModel }) => {
  return (
    <div className="container max-w-[720px] pb-4">
      <Breadcrumb className="mt-4 mb-2">
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

      <div className="md:border-1 border-none px-4 py-0 shadow-none md:rounded-lg md:border-solid md:border-gray-200 md:py-4 md:shadow-lg">
        <Result
          status="success"
          title="Đơn hàng của bạn đã được đặt thành công!"
          subTitle={`Mã đơn hàng: ${order?.key}. Chúng tôi sẽ xử lý đơn hàng và giao cho bạn trong thời gian sớm nhất.`}
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

  console.log(context.params?.['order']);
  const order = new OrderClient(context, {});
  const orderResponse = await order.getOrder({
    key: context.params?.['order'] as string,
  });

  if (orderResponse.data) {
    serverSideProps.props.order = orderResponse.data;
  }

  return serverSideProps;
};
