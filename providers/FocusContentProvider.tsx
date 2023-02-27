import FocusContentModel from '@configs/models/focus-content.model';
import React from 'react';

const FocusContentContext = React.createContext<{
  focusContent: FocusContentModel[];
}>({
  focusContent: [],
});

function FocusContentProvider({
  focusContent,
  children,
}: {
  focusContent: FocusContentModel[];
  children: React.ReactNode;
}) {
  return (
    <FocusContentContext.Provider
      value={{
        focusContent,
      }}
    >
      {children}
    </FocusContentContext.Provider>
  );
}

export function useFocusContent() {
  const context = React.useContext(FocusContentContext);

  //   if (context === undefined) {
  //     throw new Error('__void');
  //   }

  return context;
}

export default FocusContentProvider;
