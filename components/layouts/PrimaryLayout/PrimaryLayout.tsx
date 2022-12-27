import { Layout } from 'antd';
import PrimaryHeader from '../PrimaryHeader';
import PrimaryFooter from '../PrimaryFooter';

export interface IPrimaryLayout {
  children: React.ReactNode;
}

const PrimaryLayout: React.FC<IPrimaryLayout> = ({ children }) => {
  return (
    <>
      <PrimaryHeader />
      <Layout.Content>{children}</Layout.Content>
      <PrimaryFooter />
    </>
  );
};

export default PrimaryLayout;
