import { Button, Divider, Empty, Spin, Tag, Typography } from 'antd';
import { MapPin } from 'react-feather';
import React, { useEffect, useRef, useState } from 'react';
import { useAddresses } from '@providers/AddressesProvider';
import { useMasterData } from '@providers/MasterDataProvider';
import AddressModel from '@configs/models/address.model';
import AddressEditMode from '@configs/types/address-edit-mode.type';
import AddressesModal from './AddressesModal';
import Link from 'next/link';

function Addresses({
  pickOnly,
  onAddressSelect,
}: {
  pickOnly?: boolean;
  onAddressSelect?: (address: AddressModel) => void;
}) {
  const [mode, setMode] = useState<AddressEditMode | undefined>();

  const edittingAddress = useRef<AddressModel | undefined>();

  const { getAddresses, gettingAddresses, addresses, deleteAddress } =
    useAddresses();
  const { loadProvinces } = useMasterData();

  useEffect(() => {
    getAddresses();
    loadProvinces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddressAddingMode = () => {
    setMode('add');
  };

  const resetAddressAddingMode = () => {
    edittingAddress.current = undefined;
    setMode(undefined);
  };

  return (
    <>
      <Spin spinning={gettingAddresses}>
        {addresses?.map((address, index) => (
          <div className="flex items-center justify-between" key={index}>
            <div className="mb-4 flex flex-col items-start">
              <div className="flex items-center gap-1 lg:gap-2">
                <Typography.Text className="font-medium">
                  #{index + 1}
                </Typography.Text>
                {!pickOnly && (
                  <>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        setMode('edit');
                        edittingAddress.current = address;
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      type="text"
                      size="small"
                      danger
                      onClick={() => {
                        if (address.key) {
                          deleteAddress({
                            key: address.key,
                          });
                        }
                      }}
                    >
                      Xóa
                    </Button>
                  </>
                )}
              </div>

              <Typography.Text>
                {address.address}, {address.wardName}, {address.districtName},{' '}
                {address.provinceName}
              </Typography.Text>

              {address.isDefault && (
                <Tag color="blue" className="mt-2 inline-block">
                  <Typography className="text-xs">Địa chỉ mặc định</Typography>
                </Tag>
              )}
            </div>

            {onAddressSelect && (
              <Button
                size="small"
                type="default"
                onClick={() => onAddressSelect?.(address)}
              >
                Sử dụng
              </Button>
            )}
          </div>
        ))}

        {pickOnly && addresses?.length === 0 && (
          <Empty
            className="mt-8"
            description={
              <Typography>Bạn chưa có đơn hàng nào ở đây</Typography>
            }
          >
            <Link href="/thong-tin-ca-nhan">
              <a>
                <Button type="primary" ghost>
                  Quản lý sổ địa chỉ
                </Button>
              </a>
            </Link>
          </Empty>
        )}
      </Spin>

      <Divider className="my-4" />

      <Button
        type="primary"
        className="shadow-none"
        onClick={openAddressAddingMode}
        icon={<MapPin size={14} className="mr-1 align-middle" />}
      >
        Thêm địa chỉ mới
      </Button>

      <AddressesModal
        open={!!mode}
        mode={mode}
        onReset={resetAddressAddingMode}
        title={mode === 'add' ? 'Thêm địa chỉ mới' : 'Chỉnh sửa địa chỉ'}
        okText={mode === 'add' ? 'Thêm' : 'Lưu'}
        cancelText="Hủy"
        defaultAddress={edittingAddress.current}
      />
    </>
  );
}

export default Addresses;
