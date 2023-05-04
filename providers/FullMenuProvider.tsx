import MenuModel from '@configs/models/menu.model';
import Product from '@configs/models/product.model';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const FullMenuContext = React.createContext<{
  fullMenu: MenuModel[];
  open: boolean;
  setOpen: (open: boolean) => void;
  intoPopover: boolean;
  setIntoPopover: (intoPopover: boolean) => void;
  productsMenu: { [key: string]: Product[] };
  addProductMenu: (key: string, products: Product[]) => void;
}>({
  fullMenu: [],
  open: false,
  setOpen: () => undefined,
  intoPopover: false,
  setIntoPopover: () => undefined,
  productsMenu: {},
  addProductMenu: () => undefined,
});

function FullMenuProvider({
  fullMenu,
  children,
}: {
  fullMenu: MenuModel[];
  children: React.ReactNode;
}) {
  const [fullMenuPassDown, setFullMenuPassDown] = useState(fullMenu);
  const [open, setOpen] = useState(false);
  const [intoPopover, setIntoPopover] = useState(false);
  const [productsMenu, setProductsMenu] = useState<{
    [key: string]: Product[];
  }>({});

  useEffect(() => {
    if (fullMenu.length) {
      setFullMenuPassDown(fullMenu);
    }
  }, [fullMenu]);

  const addProductMenu = useCallback((key: string, products: Product[]) => {
    setProductsMenu((prev) => ({
      ...prev,
      [key]: products,
    }));
  }, []);

  const value = useMemo(
    () => ({
      fullMenu: fullMenuPassDown,
      open,
      setOpen,
      intoPopover,
      setIntoPopover,
      productsMenu,
      addProductMenu,
    }),
    [addProductMenu, fullMenuPassDown, intoPopover, open, productsMenu]
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
