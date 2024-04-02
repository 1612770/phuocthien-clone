import FocusContentModel from '@configs/models/focus-content.model';
import MainInfoModel from '@configs/models/main-info.model';
import ProductSearchKeyword from '@configs/models/product-search-keyword.model';
import { GeneralClient } from '@libs/client/General';
import React, { memo, useCallback, useState } from 'react';

const AppDataContext = React.createContext<{
  focusContent: FocusContentModel[];
  // mainInfoFooter: MainInfoModel[];
  productSearchKeywords: ProductSearchKeyword[];
  setProductSearchKeywords: React.Dispatch<
    React.SetStateAction<ProductSearchKeyword[]>
  >;
  getProductSearchKeywords: () => Promise<void>;
}>({
  focusContent: [],
  // mainInfoFooter: [],
  productSearchKeywords: [],
  setProductSearchKeywords: () => undefined,
  getProductSearchKeywords: () => Promise.resolve(),
});

function AppDataProvider({
  focusContent,
  // mainInfoFooter,
  children,
}: {
  focusContent: FocusContentModel[];
  // mainInfoFooter: MainInfoModel[];
  children: React.ReactNode;
}) {
  const [productSearchKeywords, setProductSearchKeywords] = useState<
    ProductSearchKeyword[]
  >([]);

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
        // mainInfoFooter,
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

  return context;
}

export default AppDataProvider;
