import { Layout } from 'antd';
import PrimaryHeader from '../PrimaryHeader';
import PrimaryFooter from '../PrimaryFooter';
import React from 'react';

export interface IPrimaryLayout {
  children: React.ReactNode;
  showSearch?: boolean;
  background?: 'white' | 'primary';
}

const PrimaryLayout: React.FC<IPrimaryLayout> = ({
  showSearch,
  background = 'white',
  children,
}) => {
  const computedBg =
    background === 'white' ? 'bg-gray-50' : 'bg-primary-background';

  return (
    <>
      <PrimaryHeader showSearch={showSearch} />
      <Layout.Content className={computedBg}>{children}</Layout.Content>
      <PrimaryFooter />
    </>
  );
};

export default PrimaryLayout;
