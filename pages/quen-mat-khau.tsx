import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { Button, Card, Form, Input, Typography } from 'antd';
import { Check, Key, Phone, User } from 'react-feather';
import { useState } from 'react';
import Link from 'next/link';
import OtpUtils from '@libs/utils/otp.utils';
import { useAppMessage } from '@providers/AppMessageProvider';
import { AuthClient } from '@libs/client/Auth';
import OTPInput from '@components/templates/OTPInput';
import ErrorCodes from '@configs/enums/error-codes.enum';
import { REGEX_PHONE } from '@configs/env';

export enum ForgotPasswordSteps {
  EnterPhoneNumber = 'EnterPhoneNumber',
  EnterOTP = 'EnterOTP',
  EnterNewPassword = 'EnterNewPassword',
  Finish = 'Finish',
}

const LoginPage: NextPageWithLayout = () => {
  const [step, setStep] = useState(ForgotPasswordSteps.EnterPhoneNumber);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const [sendingOtp, setSendingOtp] = useState(false);
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const { toastError } = useAppMessage();

  const sendOtp = async () => {
    try {
      const auth = new AuthClient(null, {});

      setSendingOtp(true);

      const verifyPhoneResponse = await auth.verifyPhone({
        phoneNumber: phone,
      });

      if (
        verifyPhoneResponse.data?.code !== ErrorCodes.PHONE_EXISTED_IN_SYSTEM
      ) {
        throw new Error('Số điện thoại không tồn tại trong hệ thống');
      }

      if (!OtpUtils.checkOtpNeedSending(phone)) {
        setStep(ForgotPasswordSteps.EnterOTP);

        return;
      }

      const sendOtpResponse = await auth.sendOtp({ phoneNumber: phone });

      if (!sendOtpResponse.data?.verifyToken) {
        throw new Error(
          'Chúng tôi không thể kết nối server, vui lòng thử lại sau ít phút'
        );
      }

      OtpUtils.addPhoneToLocalStorage({
        phone,
        verifyToken: sendOtpResponse.data.verifyToken,
      });

      setStep(ForgotPasswordSteps.EnterOTP);
    } catch (error) {
      toastError({ data: error });
    } finally {
      setSendingOtp(false);
    }
  };

  const submitOtp = async (otp: string) => {
    const verifyToken = OtpUtils.getVerifyTokenFromLocalStorage(phone);

    try {
      if (!verifyToken) {
        throw new Error('Vui lòng xác nhận số điện thoại trước khi tiếp tục');
      }

      setSubmittingOtp(true);

      const auth = new AuthClient(null, {});
      await auth.verifyOtp({
        verifyToken,
        otpCode: otp,
      });

      setStep(ForgotPasswordSteps.EnterNewPassword);
    } catch (error) {
      toastError({ data: error });
    } finally {
      setSubmittingOtp(false);
    }
  };

  const updatePasswordByPhone = async () => {
    const verifyToken = OtpUtils.getVerifyTokenFromLocalStorage(phone);

    try {
      if (!verifyToken) {
        throw new Error('Vui lòng xác nhận số điện thoại trước khi tiếp tục');
      }

      setUpdatingPassword(true);

      const auth = new AuthClient(null, {});
      await auth.updatePasswordByPhone({
        phoneNumber: phone,
        verifyToken,
        password,
      });

      OtpUtils.removePhoneOutOfLocalStorage(phone);

      setStep(ForgotPasswordSteps.Finish);
    } catch (error) {
      toastError({ data: error });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-[420px] pb-8 lg:container">
      <Card className="mt-0 flex flex-col items-center border-0 border-solid border-gray-200 shadow-none md:mt-8 md:border md:shadow-xl">
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
              scrollToFirstError
              onFinish={sendOtp}
            >
              <Form.Item
                hasFeedback
                className="w-full"
                name="phone"
                rules={[
                  {
                    pattern: new RegExp(REGEX_PHONE),
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
              {phone}
            </Typography.Title>

            <OTPInput
              onSubmit={submitOtp}
              loading={submittingOtp}
              phoneNumber={phone}
            />
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
              scrollToFirstError
              onFinish={updatePasswordByPhone}
            >
              <Form.Item
                hasFeedback
                className="w-full"
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
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
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
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
                  loading={updatingPassword}
                  icon={<Check size={20} className="mr-1 align-text-bottom" />}
                >
                  Xác nhận
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {step === ForgotPasswordSteps.Finish && (
          <>
            <Typography.Title
              level={3}
              className="mt-2 mb-4 text-center text-primary"
            >
              Thành công
            </Typography.Title>
            <Typography className="text-center">
              Bạn đã cập nhật mật khẩu mới cho tài khoản với số {phone} thành
              công. Vui lòng quay trở lại trang đăng nhập để tiếp tục
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

export default LoginPage;

LoginPage.getLayout = (page) => {
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};
