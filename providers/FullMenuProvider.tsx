import MenuModel from '@configs/models/menu.model';
import Product from '@configs/models/product.model';
import { GeneralClient } from '@libs/client/General';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const FullMenuContext = React.createContext<{
  fullMenu: MenuModel[];
  open: boolean;
  setOpen: (open: boolean) => void;
  intoPopover: boolean;
  setIntoPopover: (intoPopover: boolean) => void;
  productsMenu: { [key: string]: Product[] };
  addProductMenu: (key: string, products: Product[]) => void;
  setFullMenu: (fullMenu: MenuModel[]) => void;
  getFullMenu: () => void;
}>({
  fullMenu: [],
  open: false,
  setOpen: () => undefined,
  intoPopover: false,
  setIntoPopover: () => undefined,
  productsMenu: {},
  addProductMenu: () => undefined,
  setFullMenu: () => undefined,
  getFullMenu: () => undefined,
});

function FullMenuProvider({ children }: { children: React.ReactNode }) {
  const [fullMenuPassDown, setFullMenuPassDown] = useState<MenuModel[]>([]);
  const [open, setOpen] = useState(false);
  const [intoPopover, setIntoPopover] = useState(false);
  const [productsMenu, setProductsMenu] = useState<{
    [key: string]: Product[];
  }>({});

  const setFullMenu = (fullMenu: MenuModel[]) => {
    setFullMenuPassDown(fullMenu);
  };

  const getFullMenu = useCallback(async () => {
    const generalClient = new GeneralClient(null, {});
    const res = await generalClient.getMenu();
    if (res.status == 'OK' && res.data && res.data.length > 0) {
      setFullMenuPassDown(res.data);
    }
  }, []);

  const addProductMenu = useCallback((key: string, products: Product[]) => {
    setProductsMenu((prev) => ({
      ...prev,
      [key]: products,
    }));
  }, []);

  const value = useMemo(
    () => ({
      fullMenu: fullMenuPassDown,
      setFullMenu: setFullMenu,
      open,
      setOpen,
      intoPopover,
      setIntoPopover,
      productsMenu,
      addProductMenu,
      getFullMenu,
    }),
    [
      addProductMenu,
      fullMenuPassDown,
      intoPopover,
      open,
      productsMenu,
      getFullMenu,
    ]
  );

  return (
    <FullMenuContext.Provider value={value}>
      {children}
    </FullMenuContext.Provider>
  );
}

export function useFullMenu() {
  const context = React.useContext(FullMenuContext);

  //   if (context === undefined) {
  //     throw new Error('__void');
  //   }

  return context;
}

export default FullMenuProvider;
