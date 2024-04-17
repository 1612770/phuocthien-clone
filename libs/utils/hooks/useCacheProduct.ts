import { useEffect } from 'react';
import LocalStorageUtils, { LocalStorageKeys } from '../local-storage.utils';

export function useCacheProduct(productKey?: string) {
  const addKeyToLocalStorage = () => {
    let cacheKeys: string[] = JSON.parse(
      LocalStorageUtils.getItem(LocalStorageKeys.CACHED_PRODUCT_KEYS) || '[]'
    );

    if (productKey && !cacheKeys.includes(productKey)) {
      cacheKeys.unshift(productKey);
    }

    // slice max 5 keys in cache
    if (cacheKeys.length > 5) {
      cacheKeys = cacheKeys.slice(0, 5);
    }

    // set cache keys
    LocalStorageUtils.setItem(
      LocalStorageKeys.CACHED_PRODUCT_KEYS,
      JSON.stringify(cacheKeys)
    );
  };

  const removeKeyFromLocalStorage = () => {
    let cacheKeys: string[] = JSON.parse(
      LocalStorageUtils.getItem(LocalStorageKeys.CACHED_PRODUCT_KEYS) || '[]'
    );

    if (productKey && cacheKeys.includes(productKey)) {
      cacheKeys = cacheKeys.filter((key) => key !== productKey);
    }

    // set cache keys
    LocalStorageUtils.setItem(
      LocalStorageKeys.CACHED_PRODUCT_KEYS,
      JSON.stringify(cacheKeys)
    );
  };

  useEffect(() => {
    removeKeyFromLocalStorage();

    return () => {
      addKeyToLocalStorage();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productKey]);

  return null;
}
