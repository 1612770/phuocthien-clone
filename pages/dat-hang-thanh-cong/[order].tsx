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
import { useAuth } from '@providers/AuthProvider';
import { HomeOutlined } from '@ant-design/icons';
import { useAppMessage } from '@providers/AppMessageProvider';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';
import CurrencyUtils from '@libs/utils/currency.utils';
import ShippingTypes from '@configs/enums/shipping-types.enum';
import OrderStatuses from '@configs/enums/order-statuses.enum';

const OrderPage: NextPageWithLayout = ({ order }: { order?: OrderModel }) => {
  const [orderToShow, setOrderToShow] = useState(order);
  const [loading, setLoading] = useState(false);

  const appConfirmDialog = useAppConfirmDialog();
  const { isUserLoggedIn } = useAuth();
  const appMessage = useAppMessage();

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

  const cancelOrder = async () => {
    try {
      if (orderToShow?.key) {
        const orderClient = new OrderClient(null, {});
        setLoading(true);
        await orderClient.cancelOrder({ orderKey: orderToShow.key });

        appMessage.toastSuccess({
          data: 'Hủy đơn hàng thành công',
        });
        setOrderToShow({
          ...orderToShow,
          status: OrderStatuses.CANCELLED,
        });
      }
    } catch (error) {
      appMessage.toastError({ data: error });
    } finally {
      setLoading(false);
    }
  };

  const onConfirmCancelOrder = () => {
    appConfirmDialog.setConfirmData({
      title: 'Xác nhận hủy đơn hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      onOk: cancelOrder,
    });
  };

  const getTitleByStatus = (status?: OrderStatuses) => {
    switch (status) {
      case OrderStatuses.WAIT_FOR_CONFIRM:
        return 'Đơn hàng của bạn đã được đặt thành công!';
      case OrderStatuses.CANCELLED:
        return 'Đơn hàng của bạn đã bị hủy!';
      case OrderStatuses.SHIPPING:
        return 'Đơn hàng của bạn đang được giao!';
      case OrderStatuses.PROCESSING:
        return 'Đơn hàng của bạn đang được xử lý!';
      case OrderStatuses.COMPLETED:
        return 'Đơn hàng của bạn đã được giao thành công!';
      default:
        return 'Đơn hàng của bạn đã được đặt thành công!';
    }
  };

  const getResultStatusByStatus = (status?: OrderStatuses) => {
    switch (status) {
      case OrderStatuses.WAIT_FOR_CONFIRM:
        return 'success';
      case OrderStatuses.CANCELLED:
        return 'error';
      case OrderStatuses.SHIPPING:
        return 'info';
      case OrderStatuses.PROCESSING:
        return 'info';
      case OrderStatuses.COMPLETED:
        return 'success';
      default:
        return 'success';
    }
  };

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
            status={getResultStatusByStatus(orderToShow.status)}
            title={getTitleByStatus(orderToShow.status)}
            subTitle={
              <>
                {orderToShow.status === OrderStatuses.WAIT_FOR_CONFIRM && (
                  <Typography className="text-center">
                    Chúng tôi sẽ xử lý đơn hàng và giao cho bạn trong thời gian
                    sớm nhất.
                  </Typography>
                )}

                <div className="my-4 flex items-center justify-between gap-2 rounded-lg bg-primary-background px-4 py-2">
                  <Typography>
                    Mã đơn hàng: #<b>{orderToShow?.code}</b>
                  </Typography>
                  <div className="flex gap-2">
                    {isUserLoggedIn && (
                      <Link href="/lich-su-don-hang">
                        <Button className="px-2" type="link">
                          Quản lý đơn hàng
                        </Button>
                      </Link>
                    )}
                    {orderToShow.status === OrderStatuses.WAIT_FOR_CONFIRM && (
                      <Button
                        className="px-2"
                        type="link"
                        danger
                        loading={loading}
                        onClick={onConfirmCancelOrder}
                      >
                        Hủy đơn
                      </Button>
                    )}
                  </div>
                </div>

                <ul className="mt-4 rounded-xl bg-primary-background p-4 pl-8">
                  <li>
                    <Typography className="text-left">
                      <span className="text-gray-600">
                        Người nhận hàng&nbsp;
                      </span>
                      <Typography.Text className="font-medium">
                        {orderToShow?.receiverName}
                      </Typography.Text>
                      <span className="text-gray-600">
                        , số điện thoại&nbsp;
                      </span>
                      <Typography.Text className="font-medium">
                        {orderToShow?.receiverTel}
                      </Typography.Text>
                    </Typography>
                  </li>
                  {orderToShow?.deliveryDetail && (
                    <li>
                      <Typography className="text-left">
                        <span className="text-gray-600">
                          Nhận hàng tại&nbsp;
                        </span>
                        <Typography.Text className="font-medium">
                          {orderToShow?.deliveryDetail},{' '}
                          {orderToShow?.deliveryWard},{' '}
                          {orderToShow?.deliveryDistrict},{' '}
                          {orderToShow?.deliveryProvince}
                        </Typography.Text>
                      </Typography>
                    </li>
                  )}
                  {orderToShow?.drugstore?.key && (
                    <li>
                      <Typography className="text-left">
                        <span className="text-gray-600">
                          Nhận tại nhà thuốc&nbsp;
                        </span>
                        <Typography.Text className="font-medium">
                          {orderToShow?.drugstore.name},{' '}
                          {orderToShow?.drugstore.address}
                        </Typography.Text>
                      </Typography>
                    </li>
                  )}
                  {orderToShow.shippingType === ShippingTypes.DELIVERY && (
                    <li>
                      <Typography className="text-left">
                        <span className="text-gray-600">
                          Phí vận chuyển&nbsp;
                        </span>
                        <span className="font-bold text-primary">
                          {orderToShow?.shippingFee
                            ? CurrencyUtils.format(orderToShow?.shippingFee)
                            : 'Miễn phí'}
                        </span>
                      </Typography>
                    </li>
                  )}
                  <li>
                    <Typography className="text-left">
                      <span className="text-gray-600">Thành tiền&nbsp;</span>
                      <span className="font-bold text-primary">
                        {CurrencyUtils.format(orderToShow?.totalAmount)}
                      </span>
                    </Typography>
                  </li>
                </ul>
              </>
            }
            extra={[
              <div
                key="actions"
                className="flex flex-wrap items-center justify-center gap-2"
              >
                {isUserLoggedIn && (
                  <Link
                    href={
                      isUserLoggedIn
                        ? `/lich-su-don-hang/${orderToShow?.key}`
                        : '/'
                    }
                  >
                    <Button type="primary" className="shadow-none">
                      Chi tiết đơn hàng
                    </Button>
                  </Link>
                )}
                <Link href={'/'}>
                  <Button
                    type="primary"
                    ghost
                    className="shadow-none"
                    icon={<HomeOutlined />}
                  >
                    Về trang chủ
                  </Button>
                </Link>
              </div>,
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
