import React from 'react';

function SubCategoryList({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:border-l-1 ml-0 flex flex-wrap items-center gap-2 border border-r-0 border-l-0 border-t-0 border-b-0 border-solid border-l-gray-200 md:ml-4 lg:gap-4">
      {children}
    </div>
  );
}

export default SubCategoryList;
