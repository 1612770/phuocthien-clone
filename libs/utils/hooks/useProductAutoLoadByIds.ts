import { useCallback, useEffect, useState } from 'react';
import Product from '@configs/models/product.model';
import { useAppMessage } from '@providers/AppMessageProvider';
import { ProductClient } from '@libs/client/Product';

const useProductAutoLoadByIds = (productIds: string[]) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { toastError } = useAppMessage();

  const getDefaultProductsByIds = useCallback(
    async (productIds: string[]) => {
      if (!productIds?.length) return setProducts([]);

      // remvove duplicate productIds
      productIds = Array.from(new Set(productIds));

      try {
        setLoading(true);
        const productClient = new ProductClient(null, {});
        const product = await productClient.getProducts({
          page: 1,
          pageSize: 100,
          isPrescripted: false,
          filterByIds: productIds,
        });

        const productSortedByIds = productIds
          .map((id) => product.data?.data?.find((p) => p.key === id))
          .filter((p) => p);

        setProducts((productSortedByIds as Product[]) || []);
      } catch (error) {
        toastError({ data: error });
      } finally {
        setLoading(false);
      }
    },
    [toastError]
  );

  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pagingProductIds = productIds?.slice(start, end);
    getDefaultProductsByIds(pagingProductIds || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, JSON.stringify(productIds), getDefaultProductsByIds]);

  return {
    products,
    loading,
    page,
    pageSize,
    setPage,
    setPageSize,
  };
};

export default useProductAutoLoadByIds;
