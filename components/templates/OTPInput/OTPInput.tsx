import { AuthClient } from '@libs/client/Auth';
import { useCountdown } from '@libs/utils/hooks';
import OtpUtils from '@libs/utils/otp.utils';
import TimeUtils from '@libs/utils/time.utils';
import { useAppMessage } from '@providers/AppMessageProvider';
import { Button, Form, Input, Typography } from 'antd';
import { useState } from 'react';

function OTPInput({
  onSubmit,
  loading,
  phoneNumber,
}: {
  onSubmit: (otp: string) => void;
  loading: boolean;
  phoneNumber: string;
}) {
  const [otp, setOtp] = useState(new Array(4).fill(''));
  const [resendingOtp, setResendingOtp] = useState(false);

  const { toastError, toastSuccess } = useAppMessage();
  const { countdown } = useCountdown({
    initialCountdown:
      OtpUtils.getOTPNumberSecondsRemainingFromLocalStorage(phoneNumber),
  });

  const goTo = (idx: number) => {
    const nextInput = document.getElementById(
      `input-${idx}`
    ) as HTMLInputElement;
    nextInput.select();
  };

  const resendOtp = async () => {
    if (!OtpUtils.checkOtpNeedSending(phoneNumber)) {
      toastError({ data: 'Vui lòng đợi 10 phút để gửi lại mã OTP' });
      return;
    }

    try {
      setResendingOtp(true);
      const auth = new AuthClient(null, {});
      const sendOtpResponse = await auth.sendOtp({ phoneNumber });

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

      toastSuccess({ data: 'Đã gửi lại mã OTP' });
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
      <Typography className="text-center">
        {countdown >= 0 && (
          <>
            Mã OTP đã được gửi đến số {phoneNumber}
            <br />
            Mã OTP của bạn sẽ hết hạn sau{' '}
            <Typography.Text className="font-semibold">
              {TimeUtils.formatTimeByNumberSeconds(countdown)}
            </Typography.Text>{' '}
          </>
        )}

        {countdown < 0 && (
          <>
            Thử gửi lại OTP?.{' '}
            <Typography
              className={`inline-block font-semibold text-primary ${
                resendingOtp ? 'cursor-wait' : 'cursor-pointer'
              }`}
              onClick={() => {
                if (resendingOtp) return;

                resendOtp();
              }}
            >
              Gửi lại OTP
            </Typography>
          </>
        )}
      </Typography>

      <Form.Item className="mt-4 w-full">
        <Button
          type="primary"
          htmlType="submit"
          className="uppercase shadow-none"
          block
          loading={loading}
        >
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
}

export default OTPInput;
