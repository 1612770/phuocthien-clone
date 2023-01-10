import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { Button, Card, Form, Input, Typography } from 'antd';
import { Key, Phone } from 'react-feather';
import Link from 'next/link';

const LoginPage: NextPageWithLayout = () => {
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
        >
          <Form.Item
            noStyle
            name="username"
            rules={[
              {
                required: true,
                message: 'Vui lòng điền số điện thoại đăng nhập!',
              },
            ]}
          >
            <Input
              size="large"
              className="mt-4"
              prefix={<Phone size={20} />}
              placeholder="Số điện thoại đăng nhập"
            />
          </Form.Item>
          <Form.Item
            noStyle
            name="password"
            rules={[{ required: true, message: 'Vui lòng điền mật khẩu!' }]}
          >
            <Input
              size="large"
              className="mt-4"
              prefix={<Key size={20} />}
              type="password"
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
