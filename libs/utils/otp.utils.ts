import LocalStorageUtils, { LocalStorageKeys } from './local-storage.utils';

type LocalOTP = {
  [key: string]: DateData;
};

type DateData = {
  date?: number;
  token?: string;
};

// 10 minutes
const EXPIRED_TIME = 10 * 60 * 1000;

const OtpUtils = {
  addPhoneToLocalStorage: (payload: { phone: string; verifyToken: string }) => {
    const oldValuesString = LocalStorageUtils.getItem(
      LocalStorageKeys.OTP_SEND_TIME
    );
    const oldValues: LocalOTP = JSON.parse(oldValuesString || '{}');

    const values = {
      ...oldValues,
      [payload.phone]: {
        date: new Date().getTime(),
        token: payload.verifyToken,
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
    const lastSendTime = phoneData?.date;
    if (lastSendTime) {
      const now = new Date().getTime();
      if (now - EXPIRED_TIME > lastSendTime) {
        if (!phoneData?.token) {
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

    return oldValues[phone].token;
  },
};

export default OtpUtils;
