import FocusContentModel from '@configs/models/focus-content.model';
import ProductSearchKeyword from '@configs/models/product-search-keyword.model';
import { GeneralClient } from '@libs/client/General';
import React, { useCallback, useState } from 'react';

const AppDataContext = React.createContext<{
  focusContent: FocusContentModel[];
  productSearchKeywords: ProductSearchKeyword[];
  setProductSearchKeywords: React.Dispatch<
    React.SetStateAction<ProductSearchKeyword[]>
  >;
  getProductSearchKeywords: () => Promise<void>;
  getFocusData: () => void;
}>({
  focusContent: [],
  productSearchKeywords: [],
  setProductSearchKeywords: () => undefined,
  getProductSearchKeywords: () => Promise.resolve(),
  getFocusData: () => undefined,
});

function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [focusData, setFocusData] = useState<FocusContentModel[]>([]);
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

  const getFocusData = async () => {
    try {
      const generalClient = new GeneralClient(null, {});
      const resFocusData = await generalClient.getFocusContent();
      if (
        resFocusData.status == 'OK' &&
        resFocusData.data &&
        resFocusData.data.length > 0
      ) {
        setFocusData(resFocusData.data);
      }
    } catch (error) {
      console.error(error);
      setFocusData([]);
    }
  };
  return (
    <AppDataContext.Provider
      value={{
        focusContent: focusData,
        getFocusData,
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
