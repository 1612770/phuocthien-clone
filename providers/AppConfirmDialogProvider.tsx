import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ModalFuncProps } from 'antd';

const { confirm } = Modal;

const AppConfirmDialogContext = React.createContext<{
  setConfirmData: React.Dispatch<
    React.SetStateAction<ModalFuncProps | undefined>
  >;
}>({
  setConfirmData: () => undefined,
});

function AppConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [confirmData, setConfirmData] = useState<ModalFuncProps | undefined>(
    undefined
  );

  const showConfirm = useCallback(() => {
    if (confirmData) {
      confirm({
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        okButtonProps: {
          className: 'bg-primary',
        },
        ...confirmData,
      });
    }
  }, [confirmData]);

  useEffect(() => {
    showConfirm();
  }, [showConfirm]);

  return (
    <>
      <AppConfirmDialogContext.Provider
        value={{
          setConfirmData,
        }}
      >
        {children}
      </AppConfirmDialogContext.Provider>
    </>
  );
}

export function useAppConfirmDialog() {
  const context = React.useContext(AppConfirmDialogContext);

  //   if (context === undefined) {
  //     throw new Error('__void');
  //   }

  return context;
}

export default AppConfirmDialogProvider;
