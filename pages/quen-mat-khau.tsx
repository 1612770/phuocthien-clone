import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { Button, Card, Form, Input, Typography } from 'antd';
import { Key, Phone } from 'react-feather';
import { useState } from 'react';
import Link from 'next/link';

export enum ForgotPasswordSteps {
  // eslint-disable-next-line no-unused-vars
  EnterPhoneNumber = 'EnterPhoneNumber',
  // eslint-disable-next-line no-unused-vars
  EnterOTP = 'EnterOTP',
  // eslint-disable-next-line no-unused-vars
  EnterNewPassword = 'EnterNewPassword',
  // eslint-disable-next-line no-unused-vars
  Finish = 'Finish',
}

const LoginPage: NextPageWithLayout = () => {
  const [step, setStep] = useState(ForgotPasswordSteps.EnterPhoneNumber);

  return (
    <div className="mx-auto max-w-[420px] pb-8 lg:container">
      <Card className="mt-8 flex flex-col items-center">
        {step === ForgotPasswordSteps.EnterPhoneNumber && (
          <>
            <Typography.Title level={3} className="text-center text-primary">
              Quên mật khẩu
            </Typography.Title>
            <Typography className="text-center">
              Vui lòng nhập số điện thoại của bạn
            </Typography>
            <Typography className="text-center">
              Nhà thuốc Phước Thiện sẽ gửi cho bạn một mã để đặt lại mật khẩu
              của mình
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
                  placeholder="Số điện thoại của bạn"
                />
              </Form.Item>

              <Form.Item className="mt-4 w-full">
                <Button
                  type="primary"
                  onClick={() => {
                    setStep(ForgotPasswordSteps.EnterOTP);
                  }}
                  htmlType="submit"
                  className="uppercase shadow-none"
                  block
                >
                  Lấy mã
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {step === ForgotPasswordSteps.EnterOTP && (
          <>
            <Typography className="text-center">
              Nhập mã OTP vừa được gửi đến
            </Typography>
            <Typography.Title
              level={3}
              className="mt-2 mb-4 text-center text-primary"
            >
              033333333
            </Typography.Title>

            <Form className="flex flex-col items-center">
              <div id="input-code" className="mb-4 flex gap-4">
                <Input autoFocus size="large" className="h-[40px] w-[40px]" />
                <Input size="large" className="h-[40px] w-[40px]" />
                <Input size="large" className="h-[40px] w-[40px]" />
                <Input size="large" className="h-[40px] w-[40px]" />
              </div>
              <Typography className="text-center">
                Chưa nhận được mã ?{' '}
                <Typography className="inline-block cursor-pointer font-semibold text-primary">
                  Gửi lại mã
                </Typography>
              </Typography>

              <Form.Item className="mt-4 w-full">
                <Button
                  type="primary"
                  onClick={() => {
                    setStep(ForgotPasswordSteps.EnterNewPassword);
                  }}
                  htmlType="submit"
                  className="uppercase shadow-none"
                  block
                >
                  Xác nhận
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {step === ForgotPasswordSteps.EnterNewPassword && (
          <>
            <Typography className="text-center">
              Vui lòng nhập mật khẩu mới để đăng nhập trong những lần tiếp theo
            </Typography>

            <Form
              className="flex flex-col items-center"
              initialValues={{ remember: true }}
            >
              <Form.Item
                noStyle
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng điền mật khẩu mới!',
                  },
                ]}
              >
                <Input
                  size="large"
                  className="mt-4"
                  prefix={<Key size={20} />}
                  placeholder="Mật khẩu"
                />
              </Form.Item>
              <Form.Item
                noStyle
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập khớp mật khẩu!',
                  },
                ]}
              >
                <Input
                  size="large"
                  className="mt-4"
                  prefix={<Key size={20} />}
                  placeholder="Nhập lại mật khẩu"
                />
              </Form.Item>

              <Form.Item className="mt-4 w-full">
                <Button
                  type="primary"
                  onClick={() => {
                    setStep(ForgotPasswordSteps.Finish);
                  }}
                  htmlType="submit"
                  className="uppercase shadow-none"
                  block
                >
                  Xác nhận
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {step === ForgotPasswordSteps.Finish && (
          <>
            <Typography.Title level={3} className="text-center text-primary">
              Cập nhật thành công
            </Typography.Title>
            <Typography className="mb-4 text-center">
              Hãy quay trở về trang đăng nhập để tiếp tục
            </Typography>

            <Link href="/dang-nhap">
              <a>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="uppercase shadow-none"
                  block
                >
                  Xác nhận
                </Button>
              </a>
            </Link>
          </>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;

LoginPage.getLayout = (page) => {
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};
