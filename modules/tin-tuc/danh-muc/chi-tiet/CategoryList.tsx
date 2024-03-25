import React from 'react';

function CategoryList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export default CategoryList;
