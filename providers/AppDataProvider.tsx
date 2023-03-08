import FocusContentModel from '@configs/models/focus-content.model';
import MainInfoModel from '@configs/models/main-info.model';
import React, { useMemo } from 'react';

const AppDataContext = React.createContext<{
  focusContent: FocusContentModel[];
  mainInfo: MainInfoModel[];
}>({
  focusContent: [],
  mainInfo: [],
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
  const nonEmptyInfo = useMemo(
    () => mainInfo.filter((info) => !!info.groupInfo?.length),
    [mainInfo]
  );

  return (
    <AppDataContext.Provider
      value={{
        focusContent,
        mainInfo: nonEmptyInfo,
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
