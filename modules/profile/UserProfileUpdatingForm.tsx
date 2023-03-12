import { Button, DatePicker, Form, Input, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@providers/AuthProvider';
import { AuthClient } from '@libs/client/Auth';
import { useAppMessage } from '@providers/AppMessageProvider';
import dayjs from 'dayjs';

function UserProfileUpdatingForm() {
  const { userData } = useAuth();
  const { toastSuccess, toastError } = useAppMessage();

  const [updating, setUpdating] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [sex, setSex] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [company, setCompany] = useState('');

  const [form] = Form.useForm<{
    displayName: string;
    sex: string;
    birthday: dayjs.Dayjs;
    email: string;
    address: string;
    company: string;
  }>();

  const updateProfile = async () => {
    try {
      const authClient = new AuthClient(null, {});

      setUpdating(true);
      const values = form.getFieldsValue();
      const valuesToSubmit: Omit<typeof values, 'birthday'> & {
        birthday?: Date;
      } = {
        ...values,
        birthday: values.birthday
          ? new Date(values.birthday.toDate())
          : undefined,
      };

      await authClient.updateProfile(valuesToSubmit);

      toastSuccess({ data: 'Cập nhật thông tin thành công!' });
    } catch (error) {
      toastError({ data: error });
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      displayName: userData?.displayName || '',
      sex: userData?.sex || '',
      birthday: userData?.birthday
        ? dayjs(new Date(userData?.birthday))
        : undefined,
      email: userData?.email || '',
      address: userData?.address || '',
      company: userData?.company || '',
    });
  }, [form, userData]);

  return (
    <Form
      style={{ maxWidth: 600 }}
      autoComplete="off"
      layout="vertical"
      colon={false}
      onFinish={updateProfile}
      form={form}
    >
      <Form.Item label="Tên người dùng" name="displayName" className="mb-2">
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </Form.Item>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,_2fr]">
        <Form.Item label="Giới tính" name="sex" className="mb-2">
          <Radio.Group value={sex} onChange={(e) => setSex(e.target.value)}>
            <Radio.Button value="Nam">Nam</Radio.Button>
            <Radio.Button value="Nữ">Nữ</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Ngày sinh" name="birthday" className="mb-2">
          <DatePicker
            className="w-full"
            placeholder="VD: 01/01/2000"
            format={'DD/MM/YYYY'}
          />
        </Form.Item>
      </div>

      <Form.Item
        label="Email"
        name="email"
        className="mb-2"
        rules={[
          {
            type: 'email',
            message: 'Email không hợp lệ!',
          },
        ]}
      >
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="VD: email123@gmail.com"
        />
      </Form.Item>

      <Form.Item label="Địa chỉ" name="address" className="mb-2">
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="VD: 123 Trương Định, Hùng Vương, Quận 1, Tp. Hồ Chí Minh"
        />
      </Form.Item>

      <Form.Item label="Công ty" name="company" className="mb-2">
        <Input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="VD: Công ty cổ phần công nghệ ABC"
        />
      </Form.Item>

      <Form.Item className="mb-0 mt-4">
        <Button
          type="primary"
          htmlType="submit"
          className="shadow-none"
          loading={updating}
        >
          Lưu thay đổi
        </Button>
      </Form.Item>
    </Form>
  );
}

export default UserProfileUpdatingForm;
