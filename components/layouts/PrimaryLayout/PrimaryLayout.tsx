import { Layout } from 'antd';
import PrimaryHeader from '../PrimaryHeader';
import PrimaryFooter from '../PrimaryFooter';

export interface IPrimaryLayout {
  children: React.ReactNode;
  showSearch?: boolean;
}

const PrimaryLayout: React.FC<IPrimaryLayout> = ({
  showSearch,
  children,
}) => {
  return (
    <>
      <PrimaryHeader showSearch={showSearch} />
      <Layout.Content>{children}</Layout.Content>
      <PrimaryFooter />
    </>
  );
};

export default PrimaryLayout;
