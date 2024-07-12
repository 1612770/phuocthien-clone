import React from 'react';

function CategoryList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-center gap-2">{children}</div>;
}

export default CategoryList;
