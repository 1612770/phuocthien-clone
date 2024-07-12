import React from 'react';

function SubCategoryListItem({
  title,
  css,
  categoryId,
  slug,
  onClick,
}: {
  title: string;
  categoryId: string;
  slug: string;
  path?: string;
  css?: string;
  onClick?: (categoryId: string) => void;
}) {
  return (
    <div
      key={categoryId}
      onClick={() => onClick?.(slug)}
      className={`cursor-pointer  rounded-full border-solid border-primary bg-none px-4 py-2 text-sm font-medium hover:text-primary md:bg-white ${css}`}
    >
      {title}
    </div>
  );
}

export default SubCategoryListItem;
