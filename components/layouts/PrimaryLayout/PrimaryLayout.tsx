import { Layout } from 'antd';
import PrimaryHeader from '../PrimaryHeader';
import PrimaryFooter from '../PrimaryFooter';

export interface IPrimaryLayout {
  children: React.ReactNode;
}

const PrimaryLayout: React.FC<IPrimaryLayout> = ({ children }) => {
  return (
    <Layout className="bg-white">
      <PrimaryHeader />
      <Layout.Content>{children}</Layout.Content>
      <Layout.Footer className="mt-8 bg-primary">
        <PrimaryFooter />
      </Layout.Footer>
    </Layout>
  );
};

export default PrimaryLayout;
