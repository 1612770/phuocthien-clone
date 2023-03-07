import React, { useCallback, useMemo, useState } from 'react';
import { useAppMessage } from './AppMessageProvider';
import { AuthClient } from '@libs/client/Auth';
import AddressModel from '@configs/models/address.model';
import { useAppConfirmDialog } from './AppConfirmDialogProvider';

const AddressesContext = React.createContext<{
  addresses: AddressModel[] | undefined;
  setAddresses: (addresses: AddressModel[]) => void;

  getAddresses: () => Promise<void>;

  gettingAddresses: boolean;
  setGettingAddresses: (gettingAddresses: boolean) => void;

  createAddress: (payload: {
    address: string;
    provinceName: string;
    districtName: string;
    wardName: string;
    isDefault?: boolean;
  }) => Promise<void>;
  creatingAddress: boolean;

  updateAddress: (payload: {
    key: string;
    address: string;
    provinceName: string;
    districtName: string;
    wardName: string;
    isDefault?: boolean;
  }) => Promise<void>;
  updatingAddress: boolean;

  deleteAddress: (payload: { key: string }) => Promise<void>;
  deletingAddress: boolean;

  defaultAddress: AddressModel | undefined;
}>({
  addresses: undefined,
  setAddresses: () => undefined,

  getAddresses: () => Promise.resolve(),

  gettingAddresses: false,
  setGettingAddresses: () => undefined,

  createAddress: () => Promise.resolve(),
  creatingAddress: false,

  updateAddress: () => Promise.resolve(),
  updatingAddress: false,

  deleteAddress: () => Promise.resolve(),
  deletingAddress: false,

  defaultAddress: undefined,
});

function AddressesProvider({
  children,
  defaultAddresses,
}: {
  children: React.ReactNode;
  defaultAddresses?: AddressModel[];
}) {
  const [addresses, setAddresses] = useState<AddressModel[] | undefined>(
    defaultAddresses || undefined
  );
  const [gettingAddresses, setGettingAddresses] = useState(false);
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [updatingAddress, setUpdatingAddress] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState(false);

  const { toastError, toastSuccess } = useAppMessage();
  const { setConfirmData } = useAppConfirmDialog();

  const getAddresses = useCallback(async () => {
    try {
      setGettingAddresses(true);

      const authClient = new AuthClient(null, {});
      const addressesResponse = await authClient.getAddresses();

      setAddresses(addressesResponse.data);
    } catch (error) {
      toastError({ data: error });
    } finally {
      setGettingAddresses(false);
    }
  }, [toastError]);

  const createAddress = useCallback(
    async (payload: {
      address: string;
      provinceName: string;
      districtName: string;
      wardName: string;
      isDefault?: boolean;
    }) => {
      try {
        setCreatingAddress(true);

        const authClient = new AuthClient(null, {});
        const creatingAddress = await authClient.createAddress(payload);

        if (creatingAddress.data) {
          setAddresses(creatingAddress.data || []);
        }

        toastSuccess({ data: 'Tạo địa chỉ thành công' });
      } catch (error) {
        toastError({ data: error });
      } finally {
        setCreatingAddress(false);
      }
    },
    [toastError, toastSuccess]
  );

  const updateAddress = useCallback(
    async (payload: {
      key: string;
      address: string;
      provinceName: string;
      districtName: string;
      wardName: string;
      isDefault?: boolean;
    }) => {
      try {
        setUpdatingAddress(true);

        const authClient = new AuthClient(null, {});

        const updatingAddress = await authClient.updateAddress(payload);

        if (updatingAddress.data) {
          setAddresses(updatingAddress.data || []);
        }

        toastSuccess({ data: 'Cập nhật địa chỉ thành công' });
      } catch (error) {
        toastError({ data: error });
      } finally {
        setUpdatingAddress(false);
      }
    },
    [toastError, toastSuccess]
  );

  const deleteAddress = useCallback(
    async (payload: { key: string }) => {
      setConfirmData({
        title: 'Xác nhận',
        content: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
        onOk: async () => {
          try {
            setDeletingAddress(true);

            const authClient = new AuthClient(null, {});
            const deletingAddress = await authClient.deleteAddress(payload);

            if (deletingAddress.data) {
              setAddresses(deletingAddress.data || []);
            }

            toastSuccess({ data: 'Xóa địa chỉ thành công' });
          } catch (error) {
            toastError({ data: error });
          } finally {
            setDeletingAddress(false);
          }
        },
      });
    },
    [setConfirmData, toastError, toastSuccess]
  );

  const defaultAddress = useMemo(() => {
    if (defaultAddresses) {
      return defaultAddresses.find((address) => address.isDefault);
    }

    return undefined;
  }, [defaultAddresses]);

  return (
    <AddressesContext.Provider
      value={{
        addresses,
        setAddresses,

        getAddresses,

        gettingAddresses,
        setGettingAddresses,

        createAddress,
        creatingAddress,

        updateAddress,
        updatingAddress,

        deleteAddress,
        deletingAddress,

        defaultAddress,
      }}
    >
      {children}
    </AddressesContext.Provider>
  );
}

export function useAddresses() {
  const context = React.useContext(AddressesContext);

  return context;
}

export default AddressesProvider;
