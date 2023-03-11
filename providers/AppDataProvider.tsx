import FocusContentModel from '@configs/models/focus-content.model';
import MainInfoModel from '@configs/models/main-info.model';
import ProductSearchKeyword from '@configs/models/product-search-keyword.model';
import { GeneralClient } from '@libs/client/General';
import React, { useCallback, useMemo, useState } from 'react';

const AppDataContext = React.createContext<{
  focusContent: FocusContentModel[];
  mainInfo: MainInfoModel[];

  productSearchKeywords: ProductSearchKeyword[];
  setProductSearchKeywords: React.Dispatch<
    React.SetStateAction<ProductSearchKeyword[]>
  >;
  getProductSearchKeywords: () => Promise<void>;
}>({
  focusContent: [],
  mainInfo: [],
  productSearchKeywords: [],
  setProductSearchKeywords: () => undefined,
  getProductSearchKeywords: () => Promise.resolve(),
});

function AppDataProvider({
  focusContent,
  mainInfo,
  children,
}: {
  focusContent: FocusContentModel[];
  mainInfo: MainInfoModel[];
  children: React.ReactNode;
}) {
  const [productSearchKeywords, setProductSearchKeywords] = useState<
    ProductSearchKeyword[]
  >([]);

  const nonEmptyInfo = useMemo(
    () => mainInfo.filter((info) => !!info.groupInfo?.length),
    [mainInfo]
  );

  const getProductSearchKeywords = useCallback(async () => {
    // fetch only once
    if (productSearchKeywords.length) return;

    try {
      const generalClient = new GeneralClient(null, {});
      const productSearchKeywords =
        await generalClient.getProductSearchKeywords();

      if (productSearchKeywords.data) {
        setProductSearchKeywords(productSearchKeywords.data);
      }
    } catch (error) {
      // ignore error
    }
  }, [productSearchKeywords]);

  return (
    <AppDataContext.Provider
      value={{
        focusContent,
        mainInfo: nonEmptyInfo,

        productSearchKeywords,
        setProductSearchKeywords,
        getProductSearchKeywords,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = React.useContext(AppDataContext);

  //   if (context === undefined) {
  //     throw new Error('__void');
  //   }

  return context;
}

export default AppDataProvider;
