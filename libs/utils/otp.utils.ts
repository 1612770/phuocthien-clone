import LocalStorageUtils, { LocalStorageKeys } from './local-storage.utils';

// 10 minutes
const EXPIRED_TIME = 10 * 60 * 1000;

const OtpUtils = {
  addPhoneToLocalStorage: (phone: string) => {
    const oldValuesString = LocalStorageUtils.getItem(
      LocalStorageKeys.OTP_SEND_TIME
    );
    const oldValues = JSON.parse(oldValuesString || '{}');

    const values = {
      ...oldValues,
      [phone]: new Date().getTime(),
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
    const oldValues = JSON.parse(oldValuesString || '{}');

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
    const oldValues = JSON.parse(oldValuesString || '{}');

    const lastSendTime = oldValues[phone];
    if (lastSendTime) {
      const now = new Date().getTime();
      if (now - EXPIRED_TIME > lastSendTime) {
        return true;
      }

      return false;
    }

    return true;
  },
};

export default OtpUtils;
