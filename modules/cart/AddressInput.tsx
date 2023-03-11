import { Form, FormInstance, Input, Select, Spin } from 'antd';
import { convertStringToASCII } from '@libs/helpers';
import { useEffect } from 'react';
import { useMasterData } from '@providers/MasterDataProvider';

function AddressInput({
  form,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: FormInstance<any>;
}) {
  const {
    provinces,
    districts,
    wards,
    loadDistricts,
    loadWards,
    loadingDistricts,
    loadingWards,
  } = useMasterData();

  const currentProvinceKey = Form.useWatch('currentProvinceKey', form);
  const currentDistrictKey = Form.useWatch('currentDistrictKey', form);
  const currentWardKey = Form.useWatch('currentWardKey', form);

  useEffect(() => {
    if (currentProvinceKey) form?.validateFields(['currentProvinceKey']);
  }, [form, currentProvinceKey]);

  useEffect(() => {
    if (currentDistrictKey) form?.validateFields(['currentDistrictKey']);
  }, [form, currentDistrictKey]);

  useEffect(() => {
    if (currentWardKey) form?.validateFields(['currentWardKey']);
  }, [form, currentWardKey]);

  useEffect(() => {
    if (currentProvinceKey) {
      loadDistricts({
        provinceCode: currentProvinceKey,
      });
    }
  }, [currentProvinceKey, loadDistricts]);

  useEffect(() => {
    if (currentDistrictKey) {
      loadWards({
        districtCode: currentDistrictKey,
      });
    }
  }, [currentDistrictKey, loadWards]);

  return (
    <div className="my-2 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
      <Form.Item
        name={'currentProvinceKey'}
        className="mb-0 w-full"
        rules={[
          () => ({
            validator() {
              if (!currentProvinceKey) {
                return Promise.reject('Vui lòng chọn tỉnh/thành phố!');
              }

              return Promise.resolve('');
            },
          }),
        ]}
      >
        <Select
          showSearch
          className="w-full"
          placeholder="Nhập tỉnh/thành phố"
          allowClear
          onChange={(value) => {
            form?.setFieldsValue({
              currentProvinceKey: value,
              currentDistrictKey: null,
              currentWardKey: null,
            });
          }}
          value={currentProvinceKey}
          filterOption={(inputValue, currentOption) => {
            const option = provinces.find(
              (province) => province.provinceCode === currentOption?.value
            );

            return (
              convertStringToASCII(
                (option?.provinceName || '').toLowerCase()
              ).indexOf(convertStringToASCII(inputValue.toLowerCase())) !== -1
            );
          }}
        >
          {provinces.map((province) => {
            return (
              <Select.Option
                key={province.provinceCode}
                value={province.provinceCode}
              >
                {province.provinceName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item
        name={'currentDistrictKey'}
        className="mb-0 w-full"
        rules={[
          () => ({
            validator() {
              if (!currentDistrictKey) {
                return Promise.reject('Vui lòng chọn tỉnh/thành phố!');
              }

              return Promise.resolve('');
            },
          }),
        ]}
      >
        <Select
          showSearch
          allowClear
          className="w-full"
          placeholder="Nhập huyện/quận"
          value={currentDistrictKey}
          disabled={!currentProvinceKey || loadingDistricts}
          onChange={(value) => {
            form?.setFieldsValue({
              currentDistrictKey: value,
              currentWardKey: null,
            });
          }}
          filterOption={(inputValue, currentOption) => {
            const option = districts.find(
              (district) => district.districtCode === currentOption?.value
            );

            return (
              convertStringToASCII(
                (option?.districtName || '').toLowerCase()
              ).indexOf(convertStringToASCII(inputValue.toLowerCase())) !== -1
            );
          }}
        >
          {districts.map((district) => {
            return (
              <Select.Option
                key={district.districtCode}
                value={district.districtCode}
              >
                {district.districtName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item
        name={'currentWardKey'}
        className="mb-0 w-full"
        rules={[
          () => ({
            validator() {
              if (!currentWardKey) {
                return Promise.reject('Vui lòng chọn xã/phường!');
              }

              return Promise.resolve('');
            },
          }),
        ]}
      >
        <Select
          showSearch
          allowClear
          className="w-full"
          disabled={!currentDistrictKey || loadingWards}
          value={currentWardKey}
          onChange={(value) => {
            form?.setFieldValue('currentWardKey', value);
          }}
          placeholder="Nhập xã/phường"
          filterOption={(inputValue, currentOption) => {
            if (!currentProvinceKey) return false;

            const option =
              wards.find((ward) => ward.wardName === currentOption?.value) ||
              {};

            return (
              convertStringToASCII(
                (option?.wardName || '').toLowerCase()
              ).indexOf(convertStringToASCII(inputValue.toLowerCase())) !== -1
            );
          }}
        >
          {currentProvinceKey &&
            wards.map((ward) => {
              return (
                <Select.Option key={ward.wardName} value={ward.wardName}>
                  {ward.wardName}
                </Select.Option>
              );
            })}
        </Select>
      </Form.Item>
      <Form.Item
        style={{ marginBottom: 0 }}
        name={'address'}
        className="w-full"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập địa chỉ',
          },
        ]}
      >
        <Input placeholder="Nhập địa chỉ" />
      </Form.Item>
    </div>
  );
}

export default AddressInput;
