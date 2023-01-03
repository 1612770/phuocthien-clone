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
}

export default LocalStorageUtils;
