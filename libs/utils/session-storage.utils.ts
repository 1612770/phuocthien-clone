const SessionStorageUtils = {
  setItem: (key: string, value: string) => {
    return sessionStorage.setItem(key, value);
  },

  getItem: (key: string) => {
    return sessionStorage.getItem(key);
  },

  removeItem: (key: string) => {
    return sessionStorage.removeItem(key);
  },
};

export enum SessionStorageKeys {
  NON_AUTHENTICATED_CHECKED_OUT_CART_PRODUCTS = 'non-authenticated-checked-out-cart-products',
}

export default SessionStorageUtils;
