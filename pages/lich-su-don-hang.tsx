import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { Button, Card, Divider, List, Tag, Typography } from 'antd';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { COOKIE_KEYS } from '@libs/helpers';
import { useAuth } from '@providers/AuthProvider';
import { LogOut, User } from 'react-feather';
import ImageUtils from '@libs/utils/image.utils';
import ImageWithFallback from '@components/templates/ImageWithFallback';

const OrdersPage: NextPageWithLayout = () => {
  const { userData, logOut } = useAuth();
  return (
    <div className="min-h-screen min-w-full bg-primary-background">
      <div className="container grid grid-cols-[300px_1fr] gap-4 pt-4">
        <div>
          <List>
            <List.Item>
              <List.Item.Meta
                avatar={<User size={20} />}
                title={userData?.phoneNumber}
              />
            </List.Item>
            <List.Item onClick={logOut}>
              <List.Item.Meta
                avatar={<LogOut size={20} />}
                title={'Đăng xuất'}
              />
            </List.Item>
          </List>
        </div>
        <div>
          <Typography.Title level={3} className="font-medium">
            Danh sách đơn hàng của bạn
          </Typography.Title>

          <Card className="mb-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex">
                <Typography>Mã đơn hàng:</Typography>
                <Typography className="ml-2 font-medium">#HEBWKA888</Typography>
                &nbsp;-&nbsp;
                <Typography>Thời gian đặt:</Typography>
                <Typography className="ml-2 font-medium">
                  {new Date().toUTCString()}
                </Typography>
              </div>

              <Tag
                color={'rgb(34 197 94)'}
                className={`${'text-white'} text-base`}
              >
                Đã giao
              </Tag>
            </div>
            <Divider className="my-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`relative h-[60px] min-w-[60px] overflow-hidden rounded-lg border border-solid border-gray-200 bg-gray-100`}
                >
                  <ImageWithFallback
                    src=""
                    layout="fill"
                    objectFit="cover"
                    loading="lazy"
                    getMockImage={() =>
                      ImageUtils.getRandomMockProductImageUrl()
                    }
                  />
                </div>
                <div className="ml-4 flex flex-col">
                  <Typography>
                    KHẨU TRANG Y TẾ WINER KF94 4D TRẮNG G/10 CÁI
                  </Typography>
                </div>
              </div>

              <div>
                <Typography className="text-right">Tổng tiền:</Typography>
                <Typography className="text-right text-lg font-medium">
                  1.000.000đ
                </Typography>

                <Button ghost size="large" type="primary" className="mt-4">
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </Card>

          <Card className="mb-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex">
                <Typography>Mã đơn hàng:</Typography>
                <Typography className="ml-2 font-medium">#HEBWKA888</Typography>
                &nbsp;-&nbsp;
                <Typography>Thời gian đặt:</Typography>
                <Typography className="ml-2 font-medium">
                  {new Date().toUTCString()}
                </Typography>
              </div>

              <Tag
                color={'rgb(34 197 94)'}
                className={`${'text-white'} text-base`}
              >
                Đã giao
              </Tag>
            </div>
            <Divider className="my-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`relative h-[60px] min-w-[60px] overflow-hidden rounded-lg border border-solid border-gray-200 bg-gray-100`}
                >
                  <ImageWithFallback
                    src=""
                    layout="fill"
                    objectFit="cover"
                    loading="lazy"
                    getMockImage={() =>
                      ImageUtils.getRandomMockProductImageUrl()
                    }
                  />
                </div>
                <div className="ml-4 flex flex-col">
                  <Typography>
                    KHẨU TRANG Y TẾ WINER KF94 4D TRẮNG G/10 CÁI
                  </Typography>
                </div>
              </div>

              <div>
                <Typography className="text-right">Tổng tiền:</Typography>
                <Typography className="text-right text-lg font-medium">
                  1.000.000đ
                </Typography>

                <Button ghost size="large" type="primary" className="mt-4">
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </Card>
        </div>
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
