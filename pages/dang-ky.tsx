import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { Button, Card, Form, Input, Typography } from 'antd';
import { Phone, User } from 'react-feather';
import Link from 'next/link';

const SignUpPage: NextPageWithLayout = () => {
  return (
    <div className="mx-auto max-w-[420px] pb-8 lg:container">
      <Card className="mt-8 flex flex-col items-center">
        <Typography.Title level={3} className="text-center text-primary">
          Đăng ký
        </Typography.Title>
        <Typography className="text-center">
          Vui lòng đăng ký để được trải nghiệm những đặc quyền dành cho thành
          viên
        </Typography>

        <Form
          className="flex flex-col items-center"
          initialValues={{ remember: true }}
        >
          <Form.Item
            noStyle
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng điền số điện thoại!' },
            ]}
          >
            <Input
              size="large"
              className="mt-4"
              prefix={<Phone size={20} />}
              placeholder="Số điện thoại"
            />
          </Form.Item>

          <Form.Item className="w-full">
            <Button
              type="primary"
              htmlType="submit"
              className="mt-4 uppercase shadow-none"
              block
              icon={<User size={20} className="mr-1 align-text-bottom" />}
            >
              Đăng ký
            </Button>
          </Form.Item>

          <Form.Item className="text-center">
            Bạn đã có tài khoản?{' '}
            <Link href="/dang-nhap">
              <a className="text-primary" href="">
                Đăng nhập ngay
              </a>
            </Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignUpPage;

SignUpPage.getLayout = (page) => {
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};
