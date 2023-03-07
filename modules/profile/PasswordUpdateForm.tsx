import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { AuthClient } from '@libs/client/Auth';
import { useAppMessage } from '@providers/AppMessageProvider';

function PasswordUpdateForm() {
  const { toastSuccess, toastError } = useAppMessage();
  const [updatingPasswordForm] = Form.useForm();

  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [updating, setUpdating] = useState(false);

  const updatePassword = async () => {
    try {
      const authClient = new AuthClient(null, {});

      setUpdating(true);
      await authClient.updateProfile({
        password: newPassword,
        oldPassword: oldPassword,
      });

      toastSuccess({ data: 'Đổi mật khẩu thành công' });
      updatingPasswordForm.resetFields();
    } catch (error) {
      toastError({ data: error });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Form
      autoComplete="off"
      layout="vertical"
      style={{ maxWidth: 600 }}
      onFinish={updatePassword}
      colon={false}
      form={updatingPasswordForm}
    >
      <Form.Item
        label="Mật khẩu cũ"
        name="old-password"
        className="mb-2"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
      >
        <Input.Password
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </Form.Item>

      <Form.Item
        label="Mật khẩu mới"
        name="new-password"
        className="mb-2"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
      >
        <Input.Password
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Form.Item>

      <Form.Item
        label="Xác nhận mật khẩu"
        name="retypePassword"
        className="mb-2"
        rules={[
          { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
          { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('new-password') === value) {
                return Promise.resolve();
              }

              return Promise.reject('Mật khẩu nhập lại không trùng khớp!');
            },
          }),
        ]}
      >
        <Input.Password
          value={retypePassword}
          onChange={(e) => {
            setRetypePassword(e.target.value);
          }}
        />
      </Form.Item>

      <Form.Item className="mb-0 mt-4">
        <Button
          type="primary"
          htmlType="submit"
          className="shadow-none"
          loading={updating}
        >
          Đổi mật khẩu
        </Button>
      </Form.Item>
    </Form>
  );
}

export default PasswordUpdateForm;
