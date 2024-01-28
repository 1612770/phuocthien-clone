import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from './page';
import {
  Badge,
  Button,
  Card,
  Form,
  Input,
  Radio,
  Row,
  Tooltip,
  Typography,
} from 'antd';
import { Key, Phone, User } from 'react-feather';
import Link from 'next/link';
import { useState } from 'react';
import { AuthClient } from '@libs/client/Auth';
import { useAppMessage } from '@providers/AppMessageProvider';
import { useAuth } from '@providers/AuthProvider';
import { COOKIE_KEYS, setCookie } from '@libs/helpers';
import { useRouter } from 'next/router';
import { CheckCircleOutlined } from '@ant-design/icons';
import OTPInput from '@components/templates/OTPInput';
import ErrorCodes from '@configs/enums/error-codes.enum';
import OtpSendAims from '@configs/enums/otp-send-aims.enum';
import { REGEX_PHONE } from '@configs/env';
import OtpUtils from '@libs/utils/otp.utils';
import { ForgotPasswordSteps } from './quen-mat-khau';

const LoginPage: NextPageWithLayout = () => {
  const [step, setStep] = useState(ForgotPasswordSteps.EnterPhoneNumber);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logining, setLogining] = useState(false);
  const [typeLogin, setTypeLogin] = useState('password');
  const [phone, setPhone] = useState('');

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

      router.replace('/lich-su-don-hang');
    } catch (error) {
      toastError({ data: error });
    } finally {
      setLogining(false);
    }
  };
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

      const sendOtpResponse = await auth.sendOtp({
        phoneNumber: phone,
        aim: OtpSendAims.LOGIN,
      });

      if (!sendOtpResponse.data?.verifyToken) {
        throw new Error(
          'Chúng tôi không thể kết nối server, vui lòng thử lại sau ít phút'
        );
      }

      OtpUtils.addPhoneToLocalStorage({
        phone,
        verifyToken: sendOtpResponse.data.verifyToken,
        remainSeconds: sendOtpResponse.data?.remainSeconds,
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
      const signInResult = await auth.signInByOTP({
        verifyToken,
        otpCode: otp,
      });
      if (signInResult.data?.token) {
        setCookie(null, signInResult.data?.token, COOKIE_KEYS.TOKEN);
      }

      if (signInResult.data?.user) {
        setUserData(signInResult.data?.user);
      }

      router.replace('/lich-su-don-hang');
    } catch (error) {
      toastError({ data: error });
    } finally {
      setSubmittingOtp(false);
    }
  };
  return (
    <div className="mx-auto max-w-[420px] pt-4 pb-8 lg:container">
      <Card className="mt-0 flex flex-col items-center border-0 border-solid border-gray-200 shadow-none md:mt-8 md:border md:shadow-xl">
        <Typography.Title level={3} className="text-center text-primary">
          Đăng nhập
        </Typography.Title>
        <Typography className="text-center">
          Vui lòng đăng nhập để được trải nghiệm những đặc quyền dành cho thành
          viên
        </Typography>
        <Row className="mt-2 items-center">
          <Typography className="mr-3">Đăng nhập bằng </Typography>
          <Radio.Group
            onChange={(e) => {
              setTypeLogin(e.target.value);
              setStep(ForgotPasswordSteps.EnterPhoneNumber);
              setSendingOtp(false);
            }}
            defaultValue={'password'}
          >
            <Tooltip title={'Đăng nhập bằng mật khẩu của bạn đã tạo trước đó.'}>
              <Radio.Button value="password">Mật khẩu</Radio.Button>
            </Tooltip>
            <Tooltip
              title={
                'Đăng nhập bằng mã OTP sẽ được gửi qua số điện thoại của bạn.'
              }
            >
              <Radio.Button value="otp">Mã OTP</Radio.Button>
            </Tooltip>
          </Radio.Group>
        </Row>
        {typeLogin === 'password' && (
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
        )}
        {typeLogin === 'otp' &&
          step === ForgotPasswordSteps.EnterPhoneNumber && (
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
                  prefix={<Phone size={16} />}
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
                  icon={<User size={16} className="mr-1 align-text-bottom" />}
                >
                  Lấy mã
                </Button>
              </Form.Item>
            </Form>
          )}
        {typeLogin === 'otp' && step === ForgotPasswordSteps.EnterOTP && (
          <>
            <Typography className="mt-4 text-center">
              Nhập mã OTP vừa được gửi đến
            </Typography>
            <Typography.Title
              level={3}
              className="mt-1 mb-2 text-center text-primary"
            >
              {phone}
            </Typography.Title>

            <OTPInput
              onSubmit={submitOtp}
              loading={submittingOtp}
              phoneNumber={phone}
              aim={OtpSendAims.FORGOT_PASSWORD}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;

LoginPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
