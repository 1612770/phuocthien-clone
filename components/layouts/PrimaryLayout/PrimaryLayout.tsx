import { Layout } from 'antd';
import PrimaryHeader from '../PrimaryHeader';
import PrimaryFooter from '../PrimaryFooter';
import React, { useEffect } from 'react';
import { useFullMenu } from '@providers/FullMenuProvider';
import { useAppData } from '@providers/AppDataProvider';

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
  const { fullMenu, getFullMenu } = useFullMenu();
  const { focusContent, getFocusData } = useAppData();
  const computedBg =
    background === 'white' ? 'bg-gray-50' : 'bg-primary-background';
  useEffect(() => {
    if (fullMenu.length === 0) {
      getFullMenu();
    }
  }, [fullMenu.length, getFullMenu]);
  useEffect(() => {
    if (focusContent.length === 0) {
      getFocusData();
    }
  }, [focusContent.length, getFocusData]);
  return (
    <>
      <PrimaryHeader showSearch={showSearch} />
      <Layout.Content className={computedBg}>{children}</Layout.Content>
      <PrimaryFooter />
    </>
  );
};

export default PrimaryLayout;
