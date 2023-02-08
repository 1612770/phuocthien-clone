import OrderStatuses from '@configs/constants/order-statuses.constant';
import OrderStatusesEnum from '@configs/enums/order-statuses.enum';

const OrderStatusUtils = {
  formatOrderStatus: (status?: OrderStatusesEnum) => {
    if (!status) return OrderStatuses[OrderStatusesEnum.WAIT_FOR_CONFIRM];

    const orderStatus = OrderStatuses[status];

    if (!orderStatus) return OrderStatuses[OrderStatusesEnum.WAIT_FOR_CONFIRM];
    return orderStatus;
  },
};

export default OrderStatusUtils;
