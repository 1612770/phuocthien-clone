import OtpSendAims from '@configs/enums/otp-send-aims.enum';
import { AuthClient } from '@libs/client/Auth';
import { useCountdown } from '@libs/utils/hooks';
import OtpUtils from '@libs/utils/otp.utils';
import TimeUtils from '@libs/utils/time.utils';
import { useAppMessage } from '@providers/AppMessageProvider';
import { Button, Form, Input, Typography } from 'antd';
import { useEffect, useState } from 'react';

function OTPInput({
  onSubmit,
  loading,
  phoneNumber,
  aim,
  typeOTP,
}: {
  onSubmit: (otp: string) => void;
  loading: boolean;
  phoneNumber: string;
  aim: OtpSendAims;
  typeOTP: string;
}) {
  const [otp, setOtp] = useState(new Array(4).fill(''));
  const [resendingOtp, setResendingOtp] = useState(false);

  const { toastError, toastSuccess } = useAppMessage();
  const { countdown, setCountdown } = useCountdown({
    initialCountdown:
      OtpUtils.getOTPNumberSecondsRemainingFromLocalStorage(phoneNumber) || 0,
  });
  const [counterRetry, setCounterRetry] = useState(0);
  const { countdown: countDownRetry, setCountdown: setCountdownRetry } =
    useCountdown({ initialCountdown: 90 });
  const goTo = (idx: number) => {
    const nextInput = document.getElementById(
      `input-${idx}`
    ) as HTMLInputElement;
    nextInput.select();
  };

  const resendOtp = async () => {
    try {
      setResendingOtp(true);
      let tmp = countDownRetry;
      setCounterRetry(tmp++);
      const auth = new AuthClient(null, {});
      if (typeOTP === 'sms') {
        const sendOtpResponse = await auth.sendOtp({ phoneNumber, aim });

        if (!sendOtpResponse.data?.verifyToken) {
          throw new Error(
            'Chúng tôi không thể kết nối server, vui lòng thử lại sau ít phút'
          );
        }

        OtpUtils.addPhoneToLocalStorage({
          phone: phoneNumber,
          verifyToken: sendOtpResponse.data?.verifyToken,
          remainSeconds: sendOtpResponse.data?.remainSeconds,
        });
        setCountdown(sendOtpResponse.data?.remainSeconds);
        setCountdownRetry(90);
      } else {
        const sendOtpResponse = await auth.sendZaloOtp({ phoneNumber, aim });

        if (!sendOtpResponse.data?.verifyToken) {
          throw new Error(
            'Chúng tôi không thể kết nối server, vui lòng thử lại sau ít phút'
          );
        }

        OtpUtils.addPhoneToLocalStorage({
          phone: phoneNumber,
          verifyToken: sendOtpResponse.data?.verifyToken,
          remainSeconds: sendOtpResponse.data?.remainSeconds,
        });
        setCountdown(sendOtpResponse.data?.remainSeconds);
        setCountdownRetry(90);
      }

      toastSuccess({ data: 'Đã gửi lại mã xác thực' });
    } catch (error) {
      toastError({ data: error });
    } finally {
      setResendingOtp(false);
    }
  };

  return (
    <Form
      className="flex flex-col items-center"
      onFinish={() => {
        const finalOtp = otp.join('');
        if (finalOtp.length < 4) {
          return;
        }
        onSubmit(finalOtp);
      }}
    >
      <Typography className="mb-4 text-center">
        <>
          {typeOTP === 'zalo'
            ? `Mã xác thực đã được gửi đến tài khoản Zalo `
            : `Mã xác thực đã được gửi đến số điện thoại `}
          <b>{phoneNumber}</b>
        </>
        {countdown >= 0 && (
          <>
            {' '}
            có hiệu lực trong{' '}
            <Typography.Text className="font-semibold">
              {TimeUtils.formatTimeByNumberSeconds(countdown)}
            </Typography.Text>
          </>
        )}
        {countdown < 0 && <> đã hết hiệu lực</>}
      </Typography>
      <div id="input-code" className="mb-4 flex gap-4">
        {otp.map((key, idx) => (
          <Input
            key={idx}
            autoFocus={idx === 0}
            size="large"
            id={`input-${idx}`}
            className="h-[40px] w-[40px]"
            value={key}
            onChange={(e) => {
              const { value } = e.target;
              if (value.length > 1) {
                return;
              }

              if (value && !new RegExp('[0-9]').test(value)) {
                return;
              }

              const newOtp = [...otp];
              newOtp[idx] = value;
              setOtp(newOtp);
              if (idx < 3 && value) {
                goTo(idx + 1);
              }
            }}
            maxLength={1}
            onKeyUp={(e) => {
              if (e.key === 'Backspace' && idx > 0 && !key) {
                goTo(idx - 1);
              }

              if (e.key === 'ArrowLeft' && idx > 0) {
                goTo(idx - 1);
              }

              if (e.key === 'ArrowRight' && idx < 3) {
                goTo(idx + 1);
              }
            }}
          />
        ))}
      </div>

      <Form.Item className="mt-4 w-full">
        <Button
          type="primary"
          htmlType="submit"
          className="rounded-full uppercase shadow-none"
          block
          loading={loading}
        >
          Xác nhận
        </Button>
        <div className="mt-4 text-center">
          {countDownRetry > 0 ? (
            <>
              Gửi lại mã xác thực cho tôi (
              {TimeUtils.formatTimeByNumberSeconds(countDownRetry)})
            </>
          ) : (
            <span
              className="text-primary hover:cursor-pointer"
              onClick={
                counterRetry > 2
                  ? () => {
                      toastError({
                        data: 'Bạn chỉ được gửi lại mã xác thực 3 lần',
                      });
                    }
                  : resendOtp
              }
            >
              Gửi lại mã xác thực cho tôi
            </span>
          )}
        </div>
      </Form.Item>
    </Form>
  );
}

export default OTPInput;
