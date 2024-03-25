import React from 'react';
import LinkWrapper from '@components/templates/LinkWrapper';

function CategoryChipListItem({
  title,
  path,
  active,
}: {
  title: string;
  path: string;
  active?: boolean;
}) {
  return (
    <LinkWrapper href={path} className=" hover:text-primary">
      <div
        className={`ml-2 rounded-full border border-solid border-gray-800 px-4 py-2 text-sm font-medium hover:border-primary ${
          active
            ? 'bg-primary-500 text-white'
            : 'text-primary-500 hover:bg-primary-100 bg-white'
        }`}
      >
        {title}
      </div>
    </LinkWrapper>
  );
}

export default CategoryChipListItem;
