import { Layout } from 'antd';
import PrimaryHeader from '../PrimaryHeader';
import PrimaryFooter from '../PrimaryFooter';

export interface IPrimaryLayout {
  children: React.ReactNode;
  hideFooter?: boolean;
  showSearch?: boolean;
}

const PrimaryLayout: React.FC<IPrimaryLayout> = ({
  showSearch,
  hideFooter,
  children,
}) => {
  return (
    <>
      <PrimaryHeader showSearch={showSearch} />
      <Layout.Content>{children}</Layout.Content>
      {!hideFooter && <PrimaryFooter />}
    </>
  );
};

export default PrimaryLayout;
