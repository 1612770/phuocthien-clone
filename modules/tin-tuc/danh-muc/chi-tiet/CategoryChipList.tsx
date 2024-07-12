import React from 'react';

function CategoryChipList({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1 md:mt-4 md:gap-2">{children}</div>
  );
}

export default CategoryChipList;
