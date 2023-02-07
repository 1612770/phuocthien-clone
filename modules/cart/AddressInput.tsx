import { Col, Form, Input, Row, Select, Typography } from 'antd';
import { convertStringToASCII } from '@libs/helpers';
import { useCheckout } from '@providers/CheckoutProvider';
import { useEffect } from 'react';

const provincesOfVietNamJSON: {
  [key: string]: {
    name: string;
    'quan-huyen': {
      [key: string]: {
        name: string;
        'xa-phuong': {
          [key: string]: {
            name: string;
          };
        };
      };
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('../../public/assets/vn.json');

function AddressInput() {
  const {
    address,
    setAddress,
    currentProvinceKey,
    setCurrentProvinceKey,
    currentDistrictKey,
    setCurrentDistrictKey,
    currentWardKey,
    setCurrentWardKey,
    currentProvince,
    currentDistrict,
  } = useCheckout();

  const [form] = Form.useForm();

  useEffect(() => {
    if (currentProvinceKey) form.validateFields(['currentProvinceKey']);
  }, [form, currentProvinceKey]);

  useEffect(() => {
    if (currentDistrictKey) form.validateFields(['currentDistrictKey']);
  }, [form, currentDistrictKey]);

  useEffect(() => {
    if (currentWardKey) form.validateFields(['currentWardKey']);
  }, [form, currentWardKey]);

  return (
    <div className="my-4 rounded-lg bg-gray-50 p-4">
      <Typography.Text className="text-sm">
        Chọn địa chỉ để biết thời gian nhận hàng và phí vận chuyển (nếu có)
      </Typography.Text>

      <Form form={form}>
        <Row className="my-2" gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="currentProvinceKey"
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
                    const option = provincesOfVietNamJSON[currentOption?.key];

                    return (
                      convertStringToASCII(option?.name.toLowerCase()).indexOf(
                        convertStringToASCII(inputValue.toLowerCase())
                      ) !== -1
                    );
                  }}
                >
                  {Object.entries(provincesOfVietNamJSON).map(
                    ([key, province]) => {
                      return (
                        <Select.Option key={key} value={key}>
                          {province.name}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              </div>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="currentDistrictKey"
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

                    const option =
                      provincesOfVietNamJSON[currentProvinceKey]['quan-huyen'][
                        currentOption?.key
                      ];

                    return (
                      convertStringToASCII(option?.name.toLowerCase()).indexOf(
                        convertStringToASCII(inputValue.toLowerCase())
                      ) !== -1
                    );
                  }}
                >
                  {currentProvinceKey &&
                    Object.entries(currentProvince?.['quan-huyen'] || {}).map(
                      ([key, district]) => {
                        return (
                          <Select.Option key={key} value={key}>
                            {district.name}
                          </Select.Option>
                        );
                      }
                    )}
                </Select>
              </div>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="currentWardKey"
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
                      currentDistrict?.['xa-phuong'][currentOption?.key];

                    return (
                      convertStringToASCII(
                        (option?.name || '').toLowerCase()
                      ).indexOf(
                        convertStringToASCII(inputValue.toLowerCase())
                      ) !== -1
                    );
                  }}
                >
                  {currentProvinceKey &&
                    Object.entries(currentDistrict?.['xa-phuong'] || {}).map(
                      ([key, ward]) => {
                        return (
                          <Select.Option key={key} value={key}>
                            {ward.name}
                          </Select.Option>
                        );
                      }
                    )}
                </Select>
              </div>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              style={{ marginBottom: 0 }}
              name="address"
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
    </div>
  );
}

export default AddressInput;
