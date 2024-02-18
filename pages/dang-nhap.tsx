import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { Button, Card, Form, Input, Typography } from 'antd';
import { Phone } from 'react-feather';
import { useState } from 'react';
import { AuthClient } from '@libs/client/Auth';
import { useAppMessage } from '@providers/AppMessageProvider';
import { useAuth } from '@providers/AuthProvider';
import { COOKIE_KEYS, setCookie } from '@libs/helpers';
import { useRouter } from 'next/router';
import OTPInput from '@components/templates/OTPInput';
import ErrorCodes from '@configs/enums/error-codes.enum';
import OtpSendAims from '@configs/enums/otp-send-aims.enum';
import { REGEX_PHONE } from '@configs/env';
import OtpUtils from '@libs/utils/otp.utils';
export enum ForgotPasswordSteps {
  EnterPhoneNumber = 'EnterPhoneNumber',
  TypeOTP = 'TypeOTP',
  EnterOTP = 'EnterOTP',
  EnterNewPassword = 'EnterNewPassword',
  Finish = 'Finish',
}
const LoginPage: NextPageWithLayout = () => {
  const [step, setStep] = useState(ForgotPasswordSteps.EnterPhoneNumber);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [phone, setPhone] = useState('');
  const [selectTypeOTP, setSelectTypeOTP] = useState('');
  const { toastError } = useAppMessage();
  const { setUserData } = useAuth();
  const router = useRouter();
  //  login by password

  // verify phone
  const verifyPhone = async () => {
    try {
      const auth = new AuthClient(null, {});

      setSendingOtp(true);

      const verifyPhoneResponse = await auth.verifyPhone({
        phoneNumber: phone,
      });

      if (
        verifyPhoneResponse.data?.code !== ErrorCodes.PHONE_EXISTED_IN_SYSTEM
      ) {
        // phone is not register before
      } else {
        // phone is not registered
      }

      setStep(ForgotPasswordSteps.TypeOTP);
    } catch (error) {
      toastError({ data: error });
    } finally {
      setSendingOtp(false);
    }
  };

  // send otp by sms
  const sendOtpBySms = async () => {
    const auth = new AuthClient(null, {});
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
    setSelectTypeOTP('sms');
    setStep(ForgotPasswordSteps.EnterOTP);
  };
  const sendOtpByZalo = async () => {
    try {
      const auth = new AuthClient(null, {});

      const sendOtpResponse = await auth.sendZaloOtp({
        phoneNumber: phone,
        aim: OtpSendAims.LOGIN,
      });

      if (!sendOtpResponse.data?.verifyToken) {
        toastError({
          data: 'Chúng tôi không thể kết nối server, vui lòng thử lại sau ít phút',
        });
        return;
      }

      OtpUtils.addPhoneToLocalStorage({
        phone,
        verifyToken: sendOtpResponse.data.verifyToken,
        remainSeconds: sendOtpResponse.data?.remainSeconds,
      });

      setStep(ForgotPasswordSteps.EnterOTP);
      setSelectTypeOTP('zalo');
    } catch (error) {
      toastError({
        data: 'Số điện thoại chưa đăng kí Zalo. Không thể gửi mã xác thực qua số điện thoại này.',
      });
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
      OtpUtils.removePhoneOutOfLocalStorage(phone);
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
        {step === ForgotPasswordSteps.EnterPhoneNumber && (
          <Typography className="text-center">
            Vui lòng đăng nhập để được trải nghiệm những đặc quyền dành cho
            thành viên
          </Typography>
        )}

        {step === ForgotPasswordSteps.EnterPhoneNumber && (
          <Form
            className="flex flex-col items-center"
            initialValues={{ remember: true }}
            scrollToFirstError
            onFinish={verifyPhone}
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
                inputMode="numeric"
              />
            </Form.Item>

            <Form.Item className="w-full">
              <Button
                type="primary"
                htmlType="submit"
                className=" rounded-full uppercase shadow-none"
                block
                loading={sendingOtp}
              >
                Tiếp tục
              </Button>
            </Form.Item>
          </Form>
        )}
        {step === ForgotPasswordSteps.TypeOTP && (
          <>
            <Typography className="mt-4 text-center">
              Mã xác thực được gửi đến số điện thoại
            </Typography>
            <Typography.Title
              level={4}
              className="mt-1 mb-1 text-center text-primary"
            >
              {phone}
            </Typography.Title>
            <Typography className="mt-4 text-center">
              Vui lòng chọn hình thức nhận mã
            </Typography>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="mt-2 rounded-full uppercase shadow-none"
              block
              // loading={sendingOtp}
              onClick={sendOtpByZalo}
            >
              Nhận qua Zalo
            </Button>
            <Typography className="mt-2 text-center">
              hoặc có thể{' '}
              <span
                className="font-bold text-primary hover:cursor-pointer"
                onClick={sendOtpBySms}
              >
                nhận mã qua tin nhắn SMS
              </span>
            </Typography>
            {/* <OTPInput
              onSubmit={submitOtp}
              loading={submittingOtp}
              phoneNumber={phone}
              aim={OtpSendAims.LOGIN}
            /> */}
          </>
        )}
        {step === ForgotPasswordSteps.EnterOTP && (
          <>
            <OTPInput
              onSubmit={submitOtp}
              loading={submittingOtp}
              phoneNumber={phone}
              aim={OtpSendAims.LOGIN}
              typeOTP={selectTypeOTP}
            />
            <div className="text-center">
              {selectTypeOTP === 'zalo' ? (
                <>
                  Nếu bạn chưa có tài khoản Zalo, vui lòng chọn hình thức{' '}
                  <span
                    className="font-bold text-primary hover:cursor-pointer"
                    onClick={sendOtpBySms}
                  >
                    nhận mã xác thực qua tin nhắn SMS
                  </span>
                </>
              ) : (
                <>
                  hoặc có thể{' '}
                  <span
                    className="font-bold text-primary hover:cursor-pointer"
                    onClick={sendOtpByZalo}
                  >
                    nhận mã qua Zalo
                  </span>
                </>
              )}
            </div>
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
