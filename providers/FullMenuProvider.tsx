import Menu from '@configs/models/menu.model';
import React from 'react';

const FullMenuContext = React.createContext<{
  fullMenu: Menu[];
}>({
  fullMenu: [],
});

function FullMenuProvider({
  fullMenu,
  children,
}: {
  fullMenu: Menu[];
  children: React.ReactNode;
}) {
  return (
    <FullMenuContext.Provider value={{ fullMenu }}>
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
