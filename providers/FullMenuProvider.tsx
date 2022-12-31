import Menu from '@configs/models/menu.model';
import React, { useEffect, useState } from 'react';

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
  const [fullMenuPassDown, setFullMenuPassDown] = useState(fullMenu);

  useEffect(() => {
    if (fullMenu.length) {
      setFullMenuPassDown(fullMenu);
    }
  }, [fullMenu]);

  return (
    <FullMenuContext.Provider value={{ fullMenu: fullMenuPassDown }}>
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
