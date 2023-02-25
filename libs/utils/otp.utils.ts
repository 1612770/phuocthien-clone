import LocalStorageUtils, { LocalStorageKeys } from './local-storage.utils';

type LocalOTP = {
  [key: string]: DateData;
};

type DateData = {
  verifyToken: string;
  remainSeconds: number;
};

// 10 minutes
// const EXPIRED_TIME = 10 * 60 * 1000;

const OtpUtils = {
  addPhoneToLocalStorage: (payload: {
    phone: string;
    verifyToken: string;
    remainSeconds: number;
  }) => {
    const oldValuesString = LocalStorageUtils.getItem(
      LocalStorageKeys.OTP_SEND_TIME
    );
    const oldValues: LocalOTP = JSON.parse(oldValuesString || '{}');

    const values = {
      ...oldValues,
      [payload.phone]: {
        date: new Date().getTime(),
        verifyToken: payload.verifyToken,
        remainSeconds: payload.remainSeconds,
      },
    };

    LocalStorageUtils.setItem(
      LocalStorageKeys.OTP_SEND_TIME,
      JSON.stringify(values)
    );
  },

  removePhoneOutOfLocalStorage: (phone: string) => {
    const oldValuesString = LocalStorageUtils.getItem(
      LocalStorageKeys.OTP_SEND_TIME
    );
    const oldValues: LocalOTP = JSON.parse(oldValuesString || '{}');

    const values = {
      ...oldValues,
    };

    delete values[phone];

    LocalStorageUtils.setItem(
      LocalStorageKeys.OTP_SEND_TIME,
      JSON.stringify(values)
    );
  },

  checkOtpNeedSending: (phone: string) => {
    const oldValuesString = LocalStorageUtils.getItem(
      LocalStorageKeys.OTP_SEND_TIME
    );
    const oldValues: LocalOTP = JSON.parse(oldValuesString || '{}');

    const phoneData = oldValues[phone];
    const remainSeconds = phoneData?.remainSeconds;
    if (remainSeconds) {
      if (!remainSeconds) {
        if (!phoneData?.verifyToken) {
          return false;
        }

        return true;
      }

      return false;
    }

    return true;
  },

  getVerifyTokenFromLocalStorage: (phone: string) => {
    const oldValuesString = LocalStorageUtils.getItem(
      LocalStorageKeys.OTP_SEND_TIME
    );
    const oldValues: LocalOTP = JSON.parse(oldValuesString || '{}');

    return oldValues[phone].verifyToken;
  },

  getOTPNumberSecondsRemainingFromLocalStorage: (phone: string) => {
    const oldValuesString = LocalStorageUtils.getItem(
      LocalStorageKeys.OTP_SEND_TIME
    );
    const oldValues: LocalOTP = JSON.parse(oldValuesString || '{}');

    return +oldValues[phone].remainSeconds;
  },
};

export default OtpUtils;
