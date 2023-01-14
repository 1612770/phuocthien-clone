import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { List, Typography } from 'antd';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { COOKIE_KEYS } from '@libs/helpers';
import { useAuth } from '@providers/AuthProvider';

const OrdersPage: NextPageWithLayout = () => {
  const { logOut } = useAuth();
  return (
    <div className="container grid grid-cols-[400px_1fr]">
      <div>
        <List>
          <List.Item>Đơn hàng đã mua</List.Item>
          <List.Item onClick={logOut}>Đăng xuất</List.Item>
        </List>
      </div>
      <div>
        <Typography>Đơn hàng đã mua</Typography>
      </div>
    </div>
  );
};

export default OrdersPage;

OrdersPage.getLayout = (page) => {
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // check cookie in request
  const { req } = context;
  const token = req.cookies[COOKIE_KEYS.TOKEN];
  if (!token) {
    return {
      redirect: {
        destination: '/dang-nhap',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
