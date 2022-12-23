import { Layout } from 'antd';
import PrimaryHeader from '../PrimaryHeader';

export interface IPrimaryLayout {
  children: React.ReactNode;
}

const PrimaryLayout: React.FC<IPrimaryLayout> = ({ children }) => {
  return (
    <Layout className="bg-white">
      <PrimaryHeader />
      <Layout.Content>{children}</Layout.Content>
      <Layout.Footer />
    </Layout>
  );
};

export default PrimaryLayout;
