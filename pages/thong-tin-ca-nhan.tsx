import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Breadcrumb, Button, Form, Input, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import Link from 'next/link';
import { ChevronLeft } from 'react-feather';
import React from 'react';
import { useAuth } from '@providers/AuthProvider';
import UserLayout from '@components/layouts/UserLayout';
import AddressesProvider from '@providers/AddressesProvider';
import MasterDataProvider from '@providers/MasterDataProvider';
import Addresses from '@modules/address/Addresses';

const ProfileInformationPage: NextPageWithLayout = () => {
  const { userData } = useAuth();

  return (
    <div className="min-h-screen min-w-full bg-primary-background">
      <div className="container grid py-2">
        <Breadcrumb className="mt-2 mb-2">
          <Breadcrumb.Item>
            <Link href="/">
              <a>
                <div className="flex items-center">
                  <ChevronLeft size={14} />
                  <span>Trang chủ</span>
                </div>
              </a>
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>

        <UserLayout>
          <div className=" rounded-xl bg-white p-4 shadow-lg">
            <Typography.Title level={4} className="font-medium">
              Thông tin cá nhân
            </Typography.Title>
            <Form
              style={{ maxWidth: 600 }}
              autoComplete="off"
              layout="vertical"
              colon={false}
            >
              <Form.Item
                label="Tên người dùng"
                name="name"
                className="mb-4"
                rules={[{ required: true, message: 'Hãy nhập tên của bạn!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="tel"
                className="mb-4"
                rules={[
                  {
                    required: true,
                    message: 'Số điện thoại không được để trống!',
                  },
                ]}
              >
                <Input value={userData?.phoneNumber} />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="shadow-none"
                >
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="mt-4 rounded-xl bg-white p-4 shadow-lg">
            <Typography.Title level={4} className="font-medium">
              Sổ địa chỉ
            </Typography.Title>
            <Addresses />
          </div>

          <div className="mt-4  rounded-xl bg-white p-4 shadow-lg">
            <Typography.Title level={4} className="font-medium">
              Đổi mật khẩu
            </Typography.Title>
            <Form
              autoComplete="off"
              layout="vertical"
              style={{ maxWidth: 600 }}
              colon={false}
            >
              <Form.Item
                label="Mật khẩu cũ"
                name="old-password"
                className="mb-4"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu cũ!' },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới"
                name="new-password"
                className="mb-4"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="retype-new-password"
                className="mb-4"
                rules={[
                  { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                  ({ getFieldValue }) => ({
                    validator(value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        'Mật khẩu nhập lại không trùng khớp!'
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="shadow-none"
                >
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </div>
        </UserLayout>
      </div>
    </div>
  );
};

export default ProfileInformationPage;

ProfileInformationPage.getLayout = (page) => {
  return (
    <PrimaryLayout>
      <MasterDataProvider>
        <AddressesProvider>{page}</AddressesProvider>
      </MasterDataProvider>
    </PrimaryLayout>
  );
};
