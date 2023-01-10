import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { GetServerSideProps } from 'next';

const OrdersPage: NextPageWithLayout = () => {
  return null;
};

export default OrdersPage;

OrdersPage.getLayout = (page) => {
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/dang-nhap',
      permanent: false,
    },
  };
};
