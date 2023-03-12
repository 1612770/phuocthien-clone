import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Breadcrumb, Button, Empty, Result, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import Link from 'next/link';
import { ChevronLeft } from 'react-feather';
import React, { useEffect, useState } from 'react';
import OrderModel from '@configs/models/order.model';
import { OrderClient } from '@libs/client/Order';
import { GetServerSidePropsContext } from 'next';
import SessionStorageUtils, {
  SessionStorageKeys,
} from '@libs/utils/session-storage.utils';

const OrderPage: NextPageWithLayout = ({ order }: { order?: OrderModel }) => {
  const [orderToShow, setOrderToShow] = useState(order);

  useEffect(() => {
    if (!orderToShow) {
      const order = SessionStorageUtils.getItem(
        SessionStorageKeys.NON_AUTHENTICATED_CHECKED_OUT_CART_PRODUCTS
      );

      if (order) {
        setOrderToShow(JSON.parse(order));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container max-w-[720px] px-2 pb-4">
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

      {orderToShow?.key && (
        <div className="md:border-1 border-none px-0 py-0 shadow-none md:rounded-lg md:border-solid md:border-gray-200 md:py-4 md:shadow-lg lg:px-4">
          <Result
            className="px-2 lg:px-4"
            status="success"
            title="Đơn hàng của bạn đã được đặt thành công!"
            subTitle={
              <>
                <Typography className="text-center">
                  Mã đơn hàng: #<b>{orderToShow?.code}</b>. Chúng tôi sẽ xử lý
                  đơn hàng và giao cho bạn trong thời gian sớm nhất.
                </Typography>

                <div className="mt-4 rounded-xl bg-primary-background p-4">
                  <Typography className="text-left">
                    <span className="text-gray-600">Người nhận hàng:</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Typography.Text className="font-medium">
                      {orderToShow?.receiverName}, {orderToShow?.receiverTel}
                    </Typography.Text>
                  </Typography>
                  {orderToShow?.deliveryDetail && (
                    <Typography className="text-left">
                      <span className="text-gray-600">Địa chỉ nhận hàng:</span>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Typography.Text className="font-medium">
                        {orderToShow?.deliveryDetail},{' '}
                        {orderToShow?.deliveryWard},{' '}
                        {orderToShow?.deliveryDistrict},{' '}
                        {orderToShow?.deliveryProvince}
                      </Typography.Text>
                    </Typography>
                  )}
                  {orderToShow?.drugstore?.key && (
                    <Typography className="text-left">
                      <span className="text-gray-600">Nhận tại nhà thuốc:</span>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Typography.Text className="font-medium">
                        {orderToShow?.drugstore.name},{' '}
                        {orderToShow?.drugstore.address}
                      </Typography.Text>
                    </Typography>
                  )}
                  <Typography className="text-left">
                    <span className="text-gray-600">Tổng tiền:</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="font-bold text-primary">
                      {orderToShow?.totalAmount?.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </span>
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
      )}

      {!orderToShow?.key && (
        <div className="flex min-h-[400px] w-full items-center justify-center py-8">
          <Empty
            description={<Typography>Không tìm thấy thông tin</Typography>}
          ></Empty>
        </div>
      )}
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

  try {
    const order = new OrderClient(context, {});
    const orderResponse = await order.getOrder({
      key: context.params?.['order'] as string,
    });

    if (orderResponse.data) {
      serverSideProps.props.order = orderResponse.data;
    }
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};
