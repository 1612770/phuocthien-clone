import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { Button, Card, Form, Input, Typography } from 'antd';
import { Key, Phone } from 'react-feather';
import Link from 'next/link';
import { useState } from 'react';
import { AuthClient } from '@libs/client/Auth';
import { useAppMessage } from '@providers/AppMessageProvider\b';
import { useAuth } from '@providers/AuthProvider';
import { COOKIE_KEYS, setCookie } from '@libs/helpers';
import { useRouter } from 'next/router';

const LoginPage: NextPageWithLayout = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logining, setLogining] = useState(false);

  const { toastError } = useAppMessage();
  const { setUserData } = useAuth();
  const router = useRouter();

  const login = async () => {
    try {
      setLogining(true);

      const auth = new AuthClient(null, {});
      const signInResult = await auth.signIn({
        phoneNumber: username,
        password,
      });

      if (signInResult.data?.token) {
        setCookie(null, signInResult.data?.token, COOKIE_KEYS.TOKEN);
      }

      if (signInResult.data?.user) {
        setUserData(signInResult.data?.user);
      }

      router.replace('/');
    } catch (error) {
      toastError({ data: error });
    } finally {
      setLogining(false);
    }
  };

  return (
    <div className="mx-auto max-w-[420px] pb-8 lg:container">
      <Card className="mt-8 flex flex-col items-center">
        <Typography.Title level={3} className="text-center text-primary">
          Đăng nhập
        </Typography.Title>
        <Typography className="text-center">
          Vui lòng đăng nhập để được trải nghiệm những đặc quyền dành cho thành
          viên
        </Typography>

        <Form
          className="flex flex-col items-center"
          initialValues={{ remember: true }}
          onFinish={login}
        >
          <Form.Item
            name="username"
            className="w-full"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số điện thoại đăng nhập!',
              },
            ]}
          >
            <Input
              autoFocus
              size="large"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="mt-4"
              prefix={<Phone size={20} />}
              placeholder="Số điện thoại đăng nhập"
            />
          </Form.Item>
          <Form.Item
            name="password"
            className="w-full"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              size="large"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              prefix={<Key size={20} />}
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <Form.Item className="flex w-full flex-row-reverse">
            <Link href="/quen-mat-khau">
              <a className="text-primary">Quên mật khẩu?</a>
            </Link>
          </Form.Item>

          <Form.Item className="w-full">
            <Button
              type="primary"
              loading={logining}
              htmlType="submit"
              className="uppercase shadow-none"
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Form.Item className="text-center">
            Bạn chưa có tài khoản?{' '}
            <Link href={'/dang-ky'}>
              <a className="text-primary" href="">
                Đăng ký ngay
              </a>
            </Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;

LoginPage.getLayout = (page) => {
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};
