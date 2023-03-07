import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Breadcrumb, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import Link from 'next/link';
import { ChevronLeft } from 'react-feather';
import React from 'react';
import UserLayout from '@components/layouts/UserLayout';
import AddressesProvider from '@providers/AddressesProvider';
import MasterDataProvider from '@providers/MasterDataProvider';
import Addresses from '@modules/address/Addresses';
import UserProfileUpdatingForm from '@modules/profile/UserProfileUpdatingForm';
import PasswordUpdateForm from '@modules/profile/PasswordUpdateForm';

const ProfileInformationPage: NextPageWithLayout = () => {
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
            <UserProfileUpdatingForm />
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
            <PasswordUpdateForm />
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
