import React, { useCallback, useState } from 'react';
import { OrderClient } from '@libs/client/Order';
import OrderModel from '@configs/models/order.model';
import { useAppMessage } from './AppMessageProvider';
import WithPagination from '@configs/types/utils/with-pagination';

const OrdersContext = React.createContext<{
  orders: WithPagination<OrderModel[]> | undefined;
  setOrders: (orders: WithPagination<OrderModel[]>) => void;

  getOrders: () => Promise<void>;

  gettingOrders: boolean;
  setGettingOrders: (gettingOrders: boolean) => void;
}>({
  orders: undefined,
  setOrders: () => undefined,
  getOrders: () => Promise.resolve(),
  gettingOrders: false,
  setGettingOrders: () => undefined,
});

function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<
    WithPagination<OrderModel[]> | undefined
  >(undefined);
  const [gettingOrders, setGettingOrders] = useState(false);

  const { toastError } = useAppMessage();

  const getOrders = useCallback(async () => {
    try {
      setGettingOrders(true);

      const order = new OrderClient(null, {});
      const ordersResponse = await order.getOrders({
        page: 1,
        pageSize: 10,
      });

      setOrders(ordersResponse.data);
    } catch (error) {
      toastError({ data: error });
    } finally {
      setGettingOrders(false);
    }
  }, [toastError]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        setOrders,

        getOrders,

        gettingOrders,
        setGettingOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = React.useContext(OrdersContext);

  return context;
}

export default OrdersProvider;
