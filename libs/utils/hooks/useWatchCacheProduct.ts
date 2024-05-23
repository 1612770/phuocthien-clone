import { useCallback, useEffect, useState } from 'react';
import LocalStorageUtils, { LocalStorageKeys } from '../local-storage.utils';
import { useRouter } from 'next/router';
import { ProductClient } from '@libs/client/Product';
import { useAppMessage } from '@providers/AppMessageProvider';
import Product from '@configs/models/product.model';

function sortProductsByKeys(products: Product[], keys: string[]) {
  const sortedProducts = keys.map((key) => {
    const product = products.find((p) => p.key === key);
    return product;
  });

  return sortedProducts.filter((p) => p) as Product[];
}

export function useWatchCacheProduct() {
  const [productKeys, setProductKeys] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const router = useRouter();
  const appMessage = useAppMessage();

  useEffect(() => {
    const keys: string[] = JSON.parse(
      LocalStorageUtils.getItem(LocalStorageKeys.CACHED_PRODUCT_KEYS) || '[]'
    );
    setProductKeys(keys);
  }, [router.asPath]);

  const loadProductsByKeys = useCallback(
    async (keys: string[]) => {
      if (!keys || keys.length === 0) return;

      try {
        const productClient = new ProductClient(null, {});

        const products = await productClient.getProducts({
          page: 1,
          pageSize: 10,
          filterByIds: keys,
        });

        if (products.data) {
          setProducts(sortProductsByKeys(products.data.data, keys));
        }
      } catch (error) {
        appMessage.toastError({ data: error });
      }
    },
    [appMessage]
  );

  useEffect(() => {
    loadProductsByKeys(productKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(productKeys)]);

  return [products];
}
