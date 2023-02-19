import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Breadcrumb } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import Link from 'next/link';
import { ChevronLeft } from 'react-feather';
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import OrderModel from '@configs/models/order.model';
import { OrderClient } from '@libs/client/Order';
import UserLayout from '@components/layouts/UserLayout';

const OrderPage: NextPageWithLayout = () => {
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
        <div className="h-[400px]"></div>
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
