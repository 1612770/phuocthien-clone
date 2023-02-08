import OrderStatusesEnum from '@configs/enums/order-statuses.enum';

const OrderStatuses = {
  [OrderStatusesEnum.WAIT_FOR_CONFIRM]: {
    value: OrderStatusesEnum.WAIT_FOR_CONFIRM,
    label: 'Chờ xác nhận',
    tagColor: 'gray',
  },
  [OrderStatusesEnum.PROCESSING]: {
    value: OrderStatusesEnum.PROCESSING,
    label: 'Đang xử lý',
    tagColor: 'blue',
  },
  [OrderStatusesEnum.SHIPPING]: {
    value: OrderStatusesEnum.SHIPPING,
    label: 'Đang giao hàng',
    tagColor: 'blue',
  },
  [OrderStatusesEnum.COMPLETED]: {
    value: OrderStatusesEnum.COMPLETED,
    label: 'Đã hoàn thành',
    tagColor: 'green',
  },
  [OrderStatusesEnum.CANCELLED]: {
    value: OrderStatusesEnum.CANCELLED,
    label: 'Đã hủy',
    tagColor: 'red',
  },
};

export default OrderStatuses;
