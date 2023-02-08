import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { Button, Card, Form, Input, Typography } from 'antd';
import { Check, Key, Phone, User } from 'react-feather';
import Link from 'next/link';
import { useRef, useState } from 'react';
import OTPInput from '@components/templates/OTPInput';
import { AuthClient } from '@libs/client/Auth';
import { useAppMessage } from '@providers/AppMessageProvider';
import OtpUtils from '@libs/utils/otp.utils';
import ErrorCodes from '@configs/enums/error-codes.enum';

enum SignUpSteps {
  EnterPhone = 'EnterPhone',
  EnterOTP = 'EnterOTP',
  EnterUsernamePassword = 'EnterUsernamePassword',
  Finish = 'Finish',
}

const SignUpPage: NextPageWithLayout = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const [step, setStep] = useState(SignUpSteps.EnterPhone);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);

  const { toastError } = useAppMessage();
  const verifyTokenRef = useRef<string | undefined>();

  const submitOtp = async (otp: string) => {
    try {
      if (!verifyTokenRef.current) {
        throw new Error('Vui lòng xác nhận số điện thoại trước khi tiếp tục');
      }

      setSubmittingOtp(true);

      const auth = new AuthClient(null, {});
      await auth.verifyOtp({
        verifyToken: verifyTokenRef.current,
        otpCode: otp,
      });

      OtpUtils.removePhoneOutOfLocalStorage(phone);

      setStep(SignUpSteps.EnterUsernamePassword);
    } catch (error) {
      toastError({ data: error });
    } finally {
      setSubmittingOtp(false);
    }
  };

  const sendOtp = async () => {
    try {
      const auth = new AuthClient(null, {});

      const verifyPhoneResponse = await auth.verifyPhone({
        phoneNumber: phone,
      });

      if (
        verifyPhoneResponse.data?.code === ErrorCodes.PHONE_EXISTED_IN_SYSTEM
      ) {
        throw new Error(verifyPhoneResponse.data?.msg);
      }

      // if (!OtpUtils.checkOtpNeedSending(phone)) {
      //   setStep(SignUpSteps.EnterOTP);

      //   return;
      // }

      setSendingOtp(true);

      const sendOtpResponse = await auth.sendOtp({ phoneNumber: phone });

      if (!sendOtpResponse.data?.verifyToken) {
        throw new Error(
          'Chúng tôi không thể kết nối server, vui lòng thử lại sau ít phút'
        );
      }

      // save token to ref hold for next step
      verifyTokenRef.current = sendOtpResponse.data?.verifyToken;

      OtpUtils.addPhoneToLocalStorage(phone);

      setStep(SignUpSteps.EnterOTP);
    } catch (error) {
      toastError({ data: error });
    } finally {
      setSendingOtp(false);
    }
  };

  const createAccount = async () => {
    try {
      if (!verifyTokenRef.current) {
        throw new Error('Vui lòng xác nhận số điện thoại trước khi tiếp tục');
      }

      setCreatingAccount(true);

      const auth = new AuthClient(null, {});
      await auth.createAccount({
        phoneNumber: phone,
        verifyToken: verifyTokenRef.current,
        password,
      });

      setStep(SignUpSteps.Finish);
    } catch (error) {
      toastError({ data: error });
    } finally {
      setCreatingAccount(false);
    }
  };

  return (
    <div className="mx-auto max-w-[420px] pb-8 lg:container">
      <Card className="mt-8 flex flex-col items-center">
        {step === SignUpSteps.EnterPhone && (
          <>
            <Typography.Title level={3} className="text-center text-primary">
              Đăng ký
            </Typography.Title>
            <Typography className="text-center">
              Vui lòng đăng ký để được trải nghiệm những đặc quyền dành cho
              thành viên
            </Typography>

            <Form
              className="flex flex-col items-center"
              initialValues={{ remember: true }}
              scrollToFirstError
              onFinish={sendOtp}
            >
              <Form.Item
                hasFeedback
                className="w-full"
                name="phone"
                rules={[
                  {
                    pattern: new RegExp(process.env.NEXT_PUBLIC_REGEX_PHONE),
                    message: 'Vui lòng kiểm tra lại số điện thoại',
                  },
                  { required: true, message: 'Vui lòng điền số điện thoại!' },
                ]}
              >
                <Input
                  size="large"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
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
                  loading={sendingOtp}
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
          </>
        )}

        {step === SignUpSteps.EnterOTP && (
          <>
            <Typography className="text-center">
              Nhập mã OTP vừa được gửi đến
            </Typography>
            <Typography.Title
              level={3}
              className="mt-2 mb-4 text-center text-primary"
            >
              {phone}
            </Typography.Title>

            <OTPInput
              onSubmit={submitOtp}
              loading={submittingOtp}
              phoneNumber={phone}
            />
          </>
        )}

        {step === SignUpSteps.EnterUsernamePassword && (
          <>
            <Typography.Title
              level={3}
              className="mt-2 mb-4 text-center text-primary"
            >
              Khởi tạo mật khẩu
            </Typography.Title>
            <Typography className="text-center">
              Vui lòng nhập mật khẩu cho tài khoản với số điện thoại {phone}
            </Typography>

            <Form
              className="flex flex-col items-center"
              initialValues={{ remember: true }}
              scrollToFirstError
              onFinish={createAccount}
            >
              <Form.Item
                hasFeedback
                className="w-full"
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { len: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                ]}
              >
                <Input.Password
                  size="large"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="mt-4"
                  prefix={<Key size={20} />}
                  placeholder="Mật khẩu"
                />
              </Form.Item>
              <Form.Item
                hasFeedback
                className="w-full"
                name="retypePassword"
                rules={[
                  { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                  { len: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        'Mật khẩu nhập lại không trùng khớp!'
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  value={retypePassword}
                  onChange={(e) => {
                    setRetypePassword(e.target.value);
                  }}
                  prefix={<Key size={20} />}
                  placeholder="Nhập lại mật khẩu"
                />
              </Form.Item>

              <Form.Item className="w-full">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="mt-4 uppercase shadow-none"
                  block
                  loading={creatingAccount}
                  icon={<Check size={20} className="mr-1 align-text-bottom" />}
                >
                  Xác nhận
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {step === SignUpSteps.Finish && (
          <>
            <Typography.Title
              level={3}
              className="mt-2 mb-4 text-center text-primary"
            >
              Thành công
            </Typography.Title>
            <Typography className="text-center">
              Bạn đã tạo tài khoản từ số {phone} thành công. Vui lòng quay trở
              lại trang đăng nhập để tiếp tục
            </Typography>

            <Link href="/dang-nhap">
              <a>
                <Button
                  autoFocus
                  htmlType="submit"
                  className="mt-8 uppercase shadow-none"
                  block
                >
                  Về trang đăng nhập
                </Button>
              </a>
            </Link>
          </>
        )}
      </Card>
    </div>
  );
};

export default SignUpPage;

SignUpPage.getLayout = (page) => {
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};
