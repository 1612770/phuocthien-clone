import { Checkbox, Form, Modal, ModalProps } from 'antd';
import React, { useEffect } from 'react';
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
  const { provinces, districts, wards, loadDistricts, loadWards } =
    useMasterData();

  const { toastError } = useAppMessage();
  const [addressForm] = Form.useForm<{
    currentProvinceKey: string;
    currentDistrictKey: string;
    currentWardKey: string;
    address: string;
    isDefault?: boolean;
  }>();

  const setDefaultDistrict = async (
    defaultAddress: AddressModel,
    provinceCode: string
  ) => {
    try {
      const districts = await loadDistricts({ provinceCode });

      const foundDistrict = districts?.find(
        (district) => district.districtName === defaultAddress.districtName
      );
      addressForm.setFieldValue(
        'currentDistrictKey',
        foundDistrict?.districtCode || ''
      );
      const wards = await loadWards({
        districtCode: foundDistrict?.districtCode || '',
      });
      const foundWard = wards?.find(
        (ward) => ward.wardName === defaultAddress.wardName
      );
      addressForm.setFieldValue('currentWardKey', foundWard?.wardName || '');
    } catch (error) {
      toastError({
        data: error,
      });
    }
  };

  useEffect(() => {
    if (defaultAddress) {
      const foundProvince = provinces.find(
        (province) => province.provinceName === defaultAddress.provinceName
      );

      setDefaultDistrict(defaultAddress, foundProvince?.provinceCode || '');

      addressForm.setFieldsValue({
        currentProvinceKey: foundProvince?.provinceCode || '',
        address: defaultAddress.address,
        isDefault: defaultAddress.isDefault,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress]);

  useEffect(() => {
    if (!props.open) {
      addressForm.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  const submit = async () => {
    await addressForm?.validateFields();

    const valuesToSubmit = addressForm.getFieldsValue();

    const foundProvince = provinces.find(
      (province) => province.provinceCode === valuesToSubmit.currentProvinceKey
    );

    const foundDistrict = districts.find(
      (district) => district.districtCode === valuesToSubmit.currentDistrictKey
    );

    const foundWard = wards.find(
      (ward) => ward.wardName === valuesToSubmit.currentWardKey
    );

    if (
      !foundProvince?.provinceName ||
      !foundDistrict?.districtName ||
      !foundWard?.wardName
    )
      return;

    if (mode === 'add') {
      await createAddress({
        address: valuesToSubmit.address,
        provinceName: foundProvince?.provinceName,
        districtName: foundDistrict?.districtName,
        wardName: foundWard?.wardName,
        isDefault: valuesToSubmit.isDefault,
      });
    }

    if (mode === 'edit' && defaultAddress?.key) {
      await updateAddress({
        key: defaultAddress?.key,
        address: valuesToSubmit.address,
        provinceName: foundProvince?.provinceName,
        districtName: foundDistrict?.districtName,
        wardName: foundWard?.wardName,
        isDefault: valuesToSubmit.isDefault,
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
        style={{ maxWidth: 600 }}
        colon={false}
        form={addressForm}
      >
        <AddressInput form={addressForm} />

        <Form.Item
          name="isDefault"
          valuePropName="checked"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddressesModal;
