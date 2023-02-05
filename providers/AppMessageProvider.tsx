import { getErrorMessage } from '@libs/helpers';
import { message } from 'antd';
import { ArgsProps } from 'antd/es/message';
import React, { useCallback } from 'react';

type MessageType = Partial<ArgsProps> & { data: unknown };

function processPayloadContent(payload: MessageType, defaultContent: string) {
  payload.content = getErrorMessage(payload.data, defaultContent);
  return payload;
}

const AppMessageContext = React.createContext<{
  toastSuccess: (payload: MessageType) => void;
  toastError: (payload: MessageType) => void;
}>({
  toastSuccess: () => undefined,
  toastError: () => undefined,
});

function AppMessageProvider({ children }: { children: React.ReactNode }) {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 3,
  });

  const toastSuccess = useCallback((payload: MessageType) => {
    payload = processPayloadContent(payload, 'Thành công');

    messageApi.open({
      type: 'success',
      ...payload,
      content: payload.content || 'Thành công',
    });
  }, []);

  const toastError = useCallback((payload: MessageType) => {
    payload = processPayloadContent(payload, 'Có lỗi xảy ra');

    messageApi.open({
      type: 'error',
      ...payload,
      content: payload.content || 'Có lỗi xảy ra',
    });
  }, []);

  return (
    <>
      {contextHolder}
      <AppMessageContext.Provider
        value={{
          toastSuccess,
          toastError,
        }}
      >
        {children}
      </AppMessageContext.Provider>
    </>
  );
}

export function useAppMessage() {
  const context = React.useContext(AppMessageContext);

  //   if (context === undefined) {
  //     throw new Error('__void');
  //   }

  return context;
}

export default AppMessageProvider;
