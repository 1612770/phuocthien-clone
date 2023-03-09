import { Col, Form, Input, Row, Select, Spin } from 'antd';
import { convertStringToASCII } from '@libs/helpers';
import { useEffect } from 'react';
import { useMasterData } from '@providers/MasterDataProvider';

function AddressInput({
  id,
  address,
  setAddress,
  currentProvinceKey,
  setCurrentProvinceKey,
  currentDistrictKey,
  setCurrentDistrictKey,
  currentWardKey,
  setCurrentWardKey,
}: {
  id?: string;
  address: string;
  setAddress: (address: string) => void;
  currentProvinceKey: string | null;
  setCurrentProvinceKey: (currentProvinceKey: string | null) => void;
  currentDistrictKey: string | null;
  setCurrentDistrictKey: (currentDistrictKey: string | null) => void;
  currentWardKey: string | null;
  setCurrentWardKey: (currentWardKey: string | null) => void;
}) {
  const {
    provinces,
    districts,
    wards,
    loadDistricts,
    loadWards,
    loadingDistricts,
    loadingWards,

    form,
  } = useMasterData();

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

  useEffect(() => {
    form?.setFieldValue(id + 'address', address);
  }, [address, form, id]);

  return (
    <Form form={form} component="div">
      <Row className="my-2" gutter={[8, 8]}>
        <Col xs={24} md={12}>
          <Form.Item
            name={id + 'currentProvinceKey'}
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
            <div>
              <Select
                showSearch
                className="w-full"
                placeholder="Nhập tỉnh/thành phố"
                allowClear
                value={currentProvinceKey}
                onChange={(value) => {
                  setCurrentProvinceKey(value);
                  setCurrentDistrictKey(null);
                  setCurrentWardKey(null);
                }}
                filterOption={(inputValue, currentOption) => {
                  const option = provinces.find(
                    (province) => province.provinceCode === currentOption?.value
                  );

                  return (
                    convertStringToASCII(
                      (option?.provinceName || '').toLowerCase()
                    ).indexOf(
                      convertStringToASCII(inputValue.toLowerCase())
                    ) !== -1
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
            </div>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={id + 'currentDistrictKey'}
            className="mb-0 w-full"
            rules={[
              () => ({
                validator() {
                  if (!currentDistrictKey) {
                    return Promise.reject('Vui lòng chọn huyện/quận!');
                  }

                  return Promise.resolve('');
                },
              }),
            ]}
          >
            <Spin spinning={loadingDistricts}>
              <div>
                <Select
                  showSearch
                  className="w-full"
                  disabled={!currentProvinceKey}
                  value={currentDistrictKey}
                  placeholder="Nhập huyện/quận"
                  onChange={(value) => {
                    setCurrentDistrictKey(value);
                    setCurrentWardKey(null);
                  }}
                  filterOption={(inputValue, currentOption) => {
                    if (!currentProvinceKey) return false;

                    const option = districts.find(
                      (district) =>
                        district.districtCode === currentOption?.value
                    );

                    return (
                      convertStringToASCII(
                        (option?.districtName || '').toLowerCase()
                      ).indexOf(
                        convertStringToASCII(inputValue.toLowerCase())
                      ) !== -1
                    );
                  }}
                >
                  {currentProvinceKey &&
                    districts.map((district) => {
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
              </div>
            </Spin>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={id + 'currentWardKey'}
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
            <Spin spinning={loadingWards}>
              <div>
                <Select
                  showSearch
                  className="w-full"
                  disabled={!currentDistrictKey}
                  value={currentWardKey}
                  placeholder="Nhập xã/phường"
                  onChange={setCurrentWardKey}
                  filterOption={(inputValue, currentOption) => {
                    if (!currentProvinceKey) return false;

                    const option =
                      wards.find(
                        (ward) => ward.wardName === currentOption?.value
                      ) || {};

                    return (
                      convertStringToASCII(
                        (option?.wardName || '').toLowerCase()
                      ).indexOf(
                        convertStringToASCII(inputValue.toLowerCase())
                      ) !== -1
                    );
                  }}
                >
                  {currentProvinceKey &&
                    wards.map((ward) => {
                      return (
                        <Select.Option
                          key={ward.wardName}
                          value={ward.wardName}
                        >
                          {ward.wardName}
                        </Select.Option>
                      );
                    })}
                </Select>
              </div>
            </Spin>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            style={{ marginBottom: 0 }}
            name={id + 'address'}
            className="w-full"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập địa chỉ',
              },
            ]}
          >
            <Input
              placeholder="Nhập địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default AddressInput;
