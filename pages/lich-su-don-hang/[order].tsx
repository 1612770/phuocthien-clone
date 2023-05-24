import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Breadcrumb, Button, Divider, Tag, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import Link from 'next/link';
import {
  ChevronLeft,
  Clock,
  DollarSign,
  ShoppingBag,
  User,
} from 'react-feather';
import React, { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import OrderModel from '@configs/models/order.model';
import { OrderClient } from '@libs/client/Order';
import UserLayout from '@components/layouts/UserLayout';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import TimeUtils from '@libs/utils/time.utils';
import OrderStatusUtils from '@libs/utils/order-status.utils';
import LinkWrapper from '@components/templates/LinkWrapper';
import CurrencyUtils from '@libs/utils/currency.utils';
import OrderStatuses from '@configs/enums/order-statuses.enum';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';
import { useAppMessage } from '@providers/AppMessageProvider';
import { DeleteOutlined } from '@ant-design/icons';

const OrderPage: NextPageWithLayout<{ order?: OrderModel }> = ({ order }) => {
  const [orderToShow, setOrderToShow] = useState(order);

  const [loading, setLoading] = useState(false);

  const appConfirmDialog = useAppConfirmDialog();
  const appMessage = useAppMessage();

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
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center">
              <Tag
                color={
                  OrderStatusUtils.formatOrderStatus(orderToShow?.status)
                    .tagColor
                }
                className="shadow-none"
              >
                {OrderStatusUtils.formatOrderStatus(orderToShow?.status).label}
              </Tag>{' '}
              <Typography.Title
                level={5}
                className="m-0 inline-block align-middle font-medium"
              >
                #{orderToShow?.code}
                <Typography.Text className="font-normal text-gray-600"></Typography.Text>
              </Typography.Title>
            </div>
            {orderToShow?.status === OrderStatuses.WAIT_FOR_CONFIRM && (
              <Button
                className="px-2"
                icon={<DeleteOutlined />}
                danger
                loading={loading}
                onClick={onConfirmCancelOrder}
              >
                Hủy đơn
              </Button>
            )}
          </div>
          <Typography.Paragraph className="m-0 mb-4 text-gray-600">
            <Clock size={16} className=" align-text-top" /> Ngày đặt &nbsp;
            <Typography.Text className="font-medium">
              {TimeUtils.formatDate(orderToShow?.createdTime, {})}
            </Typography.Text>
          </Typography.Paragraph>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_minmax(200px,_300px)] md:gap-4">
          <div className="rounded-lg border border-solid border-gray-200 bg-white p-4">
            <div className="mb-2 flex items-center">
              <User size={20} className="text-primary" />
              &nbsp;
              <Typography className="text-lg">Thông tin người nhận</Typography>
            </div>
            <Typography className="mb-2 text-left">
              <Typography.Text className="text-base font-medium">
                {orderToShow?.receiverName}
              </Typography.Text>
            </Typography>
            <Typography className="text-left text-gray-800">
              {orderToShow?.receiverTel}
            </Typography>
            {orderToShow?.deliveryDetail && (
              <Typography className="text-left text-gray-800">
                {orderToShow?.deliveryDetail}, {orderToShow?.deliveryWard},{' '}
                {orderToShow?.deliveryDistrict}, {orderToShow?.deliveryProvince}
              </Typography>
            )}
            {orderToShow?.drugstore?.key && (
              <Typography className="text-left text-gray-800">
                {orderToShow?.drugstore.name}, {orderToShow?.drugstore.address}
              </Typography>
            )}
            {orderToShow?.orderNote && (
              <Typography className="mb-2 text-left">
                <Typography.Text className=" text-gray-600">
                  Ghi chú: {orderToShow?.orderNote}
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
            <ImageWithFallback
              src={orderToShow?.paymentMethod?.image || ''}
              width={60}
              height={60}
            ></ImageWithFallback>
            <Typography className="text-left">
              <Typography.Text className="">
                {orderToShow?.paymentMethod?.name}
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
            {orderToShow?.details?.map((detail) => {
              const discountVal = +(detail.promoInfo?.split('#').pop() || 0);

              return (
                <LinkWrapper
                  href={`/${detail.productType?.seoUrl}/${detail.productType?.seoUrl}/${detail.seoUrl}`}
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

                        {discountVal > 0 && (
                          <Tag className="rounded-full bg-red-500 text-white shadow-none">
                            Giảm {discountVal * 100}%
                          </Tag>
                        )}
                      </div>

                      <div className="meta flex flex-col">
                        {discountVal > 0 && (
                          <>
                            <Typography.Text className="text-right text-gray-400 line-through">
                              <Typography.Text className="text-sm text-inherit">
                                {CurrencyUtils.format(detail.price)}
                              </Typography.Text>
                              {detail.unit && (
                                <Typography.Text className="text-sm text-inherit">
                                  &nbsp;/&nbsp;{detail.unit}
                                </Typography.Text>
                              )}
                            </Typography.Text>
                            <Typography.Text className="text-sm text-gray-400">
                              <Typography.Text className="mr-2 font-medium text-inherit">
                                Tổng tiền
                              </Typography.Text>
                              <Typography.Text className="inline-block min-w-[80px] text-right text-inherit line-through">
                                {CurrencyUtils.format(detail.sumOrder)}
                              </Typography.Text>
                            </Typography.Text>
                          </>
                        )}

                        <Typography.Text className="text-right">
                          <Typography.Text className="text-sm">
                            {CurrencyUtils.formatWithDiscount(
                              detail.price,
                              discountVal
                            )}
                          </Typography.Text>
                          {detail.unit && (
                            <Typography.Text className="text-sm">
                              &nbsp;/&nbsp;{detail.unit}
                            </Typography.Text>
                          )}
                        </Typography.Text>
                        <Typography.Text className="text-sm text-gray-500">
                          <Typography.Text className="mr-2 font-medium">
                            Thành tiền
                          </Typography.Text>
                          <Typography.Text className="inline-block min-w-[80px] text-right">
                            {CurrencyUtils.format(detail.totalAmount)}
                          </Typography.Text>
                        </Typography.Text>
                      </div>
                    </div>
                  </div>
                </LinkWrapper>
              );
            })}
          </div>
        </div>
        <div className="mr-0 ml-auto w-full px-0 py-4 md:w-[400px] md:px-2">
          {orderToShow?.subTotalAmount != orderToShow?.totalAmount && (
            <div className="my-2 flex items-end justify-between px-2">
              <Typography.Text className="text-right  text-base text-gray-500">
                Tổng tiền
              </Typography.Text>
              <Typography.Text className="m-0 text-base font-medium ">
                {CurrencyUtils.format(orderToShow?.subTotalAmount)}
              </Typography.Text>
            </div>
          )}
          {(orderToShow?.shippingFee || 0) > 0 && (
            <div className="my-2 flex items-end justify-between px-2">
              <Typography.Text className="text-right  text-base text-gray-500">
                Phí vận chuyển
              </Typography.Text>
              <Typography.Text className="m-0 text-base font-medium ">
                {CurrencyUtils.format(orderToShow?.shippingFee)}
              </Typography.Text>
            </div>
          )}
          {orderToShow?.offerCode && (
            <div className="my-2 flex items-end justify-between px-2 ">
              <Typography.Text className="text-right text-base text-gray-500">
                Mã ưu đãi
              </Typography.Text>
              <Typography.Text className="m-0 text-base font-medium ">
                {orderToShow?.offerCode}
              </Typography.Text>
            </div>
          )}
          {orderToShow?.subTotalAmount != orderToShow?.totalAmount &&
            orderToShow?.offerCode && <Divider className="mt-4 mb-0" />}
          <div className="my-2 flex items-end justify-between px-2 ">
            <Typography.Text className="text-right text-base text-gray-500">
              Thành tiền
            </Typography.Text>
            <Typography.Text className="m-0 text-3xl font-bold text-primary">
              {CurrencyUtils.format(orderToShow?.totalAmount)}
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
