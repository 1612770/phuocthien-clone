import { Layout } from 'antd';
import PrimaryHeader from '../PrimaryHeader';
import PrimaryFooter from '../PrimaryFooter';

export interface IPrimaryLayout {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const PrimaryLayout: React.FC<IPrimaryLayout> = ({ hideFooter, children }) => {
  return (
    <>
      <PrimaryHeader />
      <Layout.Content>{children}</Layout.Content>
      {!hideFooter && <PrimaryFooter />}
    </>
  );
};

export default PrimaryLayout;
