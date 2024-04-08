import { Button, Divider, Tag, Tooltip, Typography, Grid } from 'antd';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';
import OrderStatusUtils from '@libs/utils/order-status.utils';
import TimeUtils from '@libs/utils/time.utils';
import OrderModel from '@configs/models/order.model';
import LinkWrapper from '@components/templates/LinkWrapper';
import { useRouter } from 'next/router';

const { useBreakpoint } = Grid;

function OrderItem({ order }: { order: OrderModel }) {
  const screens = useBreakpoint();
  const router = useRouter();
  return (
    <LinkWrapper
      href={screens.md ? undefined : `/lich-su-don-hang/${order.key}`}
    >
      <div className=" mb-4 rounded-none bg-white p-4 sm:rounded-lg sm:p-8">
        <div className="flex flex-wrap gap-0 sm:gap-2">
          <div className="flex">
            <Typography className=" whitespace-nowrap">Mã đơn hàng:</Typography>
            <Typography.Text className="ml-2 whitespace-pre-wrap font-medium">
              #{order.code}
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
              src={order.details?.[0].imageUrl || ''}
              layout="fill"
              objectFit="cover"
              loading="lazy"
              getMockImage={() => ImageUtils.getRandomMockProductImageUrl()}
            />
          </div>

          <div className="flex flex-1 flex-col items-start justify-between sm:flex-row sm:items-center">
            <div className="flex items-center">
              <div className="flex flex-col">
                <Typography className="font-medium">
                  {order.details?.[0].productName}
                </Typography>
                <Typography className="text-gray-500">
                  {order.details?.[0].quantity} {order.details?.[0].unit}
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
                      Và {(order.details?.length || 0) - 1} sản phẩm khác
                    </Typography>
                  </Tooltip>
                )}

                <div className="flex items-center gap-2">
                  <Tag
                    color={
                      OrderStatusUtils.formatOrderStatus(order.status).tagColor
                    }
                    className="mt-2  shadow-none"
                  >
                    {OrderStatusUtils.formatOrderStatus(order.status).label}
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

              <Button
                ghost
                size="small"
                type="primary"
                className="mt-2 hidden sm:block"
                onClick={() => router.push(`/lich-su-don-hang/${order.key}`)}
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        </div>
      </div>
    </LinkWrapper>
  );
}

export default OrderItem;
