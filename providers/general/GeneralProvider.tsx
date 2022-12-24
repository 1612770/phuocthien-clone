import { GeneralContext } from './useGeneral';
import { ReactNode, useRef, useState } from 'react';

export interface IGeneral {
  fullMenu: any[];
  handleSetFullMenu: any;
}
export const GeneralProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fullMenu, setFullMenu] = useState([]);

  const handleSetFullMenu = (data: any) => {
    setFullMenu(data);
  };
  return (
    <GeneralContext.Provider value={{ fullMenu, handleSetFullMenu }}>
      {children}
    </GeneralContext.Provider>
  );
};
