import { Checkbox, Form, Modal, ModalProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAddresses } from '@providers/AddressesProvider';
import { useMasterData } from '@providers/MasterDataProvider';
import AddressInput from '@modules/cart/AddressInput';
import AddressModel from '@configs/models/address.model';
import { useAppMessage } from '@providers/AppMessageProvider';
import AddressEditMode from '@configs/types/address-edit-mode.type';

function AddressesModal({
  defaultAddress,
  mode = 'add',
  onReset,
  ...props
}: ModalProps & {
  mode?: AddressEditMode;
  defaultAddress?: AddressModel;
  onReset: () => void;
}) {
  const { createAddress, updateAddress, creatingAddress, updatingAddress } =
    useAddresses();
  const { provinces, districts, wards, form, loadDistricts, loadWards } =
    useMasterData();

  const [currentProvinceKey, setCurrentProvinceKey] = useState<string | null>(
    null
  );
  const [currentDistrictKey, setCurrentDistrictKey] = useState<string | null>(
    null
  );
  const [currentWardKey, setCurrentWardKey] = useState<string | null>(null);
  const [isDefault, setIsDefault] = useState(false);

  const [address, setAddress] = useState('');

  const { toastError } = useAppMessage();

  const setDefaultDistrict = async (
    defaultAddress: AddressModel,
    provinceCode: string
  ) => {
    try {
      const districts = await loadDistricts({ provinceCode });

      const foundDistrict = districts?.find(
        (district) => district.districtName === defaultAddress.districtName
      );
      setCurrentDistrictKey(foundDistrict?.districtCode || '');
      const wards = await loadWards({
        districtCode: foundDistrict?.districtCode || '',
      });
      const foundWard = wards?.find(
        (ward) => ward.wardName === defaultAddress.wardName
      );
      setCurrentWardKey(foundWard?.wardName || '');
    } catch (error) {
      toastError({
        data: error,
      });
    }
  };

  useEffect(() => {
    if (defaultAddress) {
      setAddress(defaultAddress.address || '');

      const foundProvince = provinces.find(
        (province) => province.provinceName === defaultAddress.provinceName
      );

      setCurrentProvinceKey(foundProvince?.provinceCode || '');

      setDefaultDistrict(defaultAddress, foundProvince?.provinceCode || '');

      setIsDefault(defaultAddress.isDefault || false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress]);

  useEffect(() => {
    if (!props.open) {
      setAddress('');
      setCurrentProvinceKey(null);
      setCurrentDistrictKey(null);
      setCurrentWardKey(null);
      setIsDefault(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  const submit = async () => {
    await form?.validateFields();

    const foundProvince = provinces.find(
      (province) => province.provinceCode === currentProvinceKey
    );
    const foundDistrict = districts.find(
      (district) => district.districtCode === currentDistrictKey
    );
    const foundWard = wards.find((ward) => ward.wardName === currentWardKey);

    if (
      !foundProvince?.provinceName ||
      !foundDistrict?.districtName ||
      !foundWard?.wardName
    )
      return;

    if (mode === 'add') {
      await createAddress({
        address,
        provinceName: foundProvince?.provinceName,
        districtName: foundDistrict?.districtName,
        wardName: foundWard?.wardName,
        isDefault,
      });
    }

    if (mode === 'edit' && defaultAddress?.key) {
      await updateAddress({
        key: defaultAddress?.key,
        address,
        provinceName: foundProvince?.provinceName,
        districtName: foundDistrict?.districtName,
        wardName: foundWard?.wardName,
        isDefault,
      });
    }

    onReset();
  };
  return (
    <Modal
      {...props}
      onCancel={() => {
        onReset();
      }}
      confirmLoading={creatingAddress || updatingAddress}
      onOk={submit}
    >
      <Form
        autoComplete="off"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        colon={false}
      >
        <AddressInput
          address={address}
          setAddress={setAddress}
          currentProvinceKey={currentProvinceKey}
          setCurrentProvinceKey={setCurrentProvinceKey}
          currentDistrictKey={currentDistrictKey}
          setCurrentDistrictKey={setCurrentDistrictKey}
          currentWardKey={currentWardKey}
          setCurrentWardKey={setCurrentWardKey}
        />
        <Checkbox
          checked={isDefault}
          onChange={(e) => {
            setIsDefault(e.target.checked);
          }}
        >
          Đặt làm địa chỉ mặc định
        </Checkbox>
      </Form>
    </Modal>
  );
}

export default AddressesModal;
