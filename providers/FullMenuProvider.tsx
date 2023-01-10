import MenuModel from '@configs/models/menu.model';
import React, { useEffect, useState } from 'react';

const FullMenuContext = React.createContext<{
  fullMenu: MenuModel[];
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  intoPopover: boolean;
  // eslint-disable-next-line no-unused-vars
  setIntoPopover: (intoPopover: boolean) => void;
}>({
  fullMenu: [],
  open: false,
  setOpen: () => {},
  intoPopover: false,
  setIntoPopover: () => {},
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

  useEffect(() => {
    if (fullMenu.length) {
      setFullMenuPassDown(fullMenu);
    }
  }, [fullMenu]);

  return (
    <FullMenuContext.Provider
      value={{
        fullMenu: fullMenuPassDown,
        open,
        setOpen,
        intoPopover,
        setIntoPopover,
      }}
    >
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
