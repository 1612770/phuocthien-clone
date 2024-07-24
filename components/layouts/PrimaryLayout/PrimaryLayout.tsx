import { Layout } from 'antd';
import PrimaryHeader from '../PrimaryHeader';
import dynamic from 'next/dynamic';
import React, { memo, useEffect } from 'react';
import { useAppData } from '@providers/AppDataProvider';

const PrimaryFooter = dynamic(() => import('../PrimaryFooter'), { ssr: false });
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
  const { focusContent, getFocusData } = useAppData();

  const computedBg =
    background === 'white' ? 'bg-gray-50' : 'bg-primary-background';

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

export default memo(PrimaryLayout);
