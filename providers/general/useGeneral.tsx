import React, { useContext } from 'react';
import { IGeneral } from './GeneralProvider';

export const defaultValue: IGeneral = {
  fullMenu: [],
  handleSetFullMenu: () => {},
};

export const GeneralContext = React.createContext<IGeneral>(defaultValue);
export const useGeneral = () => useContext(GeneralContext);
