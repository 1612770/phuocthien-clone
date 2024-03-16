const LocalStorageUtils = {
  setItem: (key: string, value: string) => {
    return localStorage.setItem(key, value);
  },

  getItem: (key: string) => {
    return localStorage.getItem(key);
  },

  removeItem: (key: string) => {
    return localStorage.removeItem(key);
  },
};

export enum LocalStorageKeys {
  CART_PRODUCTS = 'products',
  CART_COMBOS = 'combos',
  CART_DEALS = 'deals',
  CART_GIFTS = 'gifts',
  OTP_SEND_TIME = 'otp-send-time',
  CACHED_PRODUCT_KEYS = 'cached-product-keys',
}

export default LocalStorageUtils;
