import React from 'react';

function ArticleList({
  children,
  viewAllSection,
}: {
  children: React.ReactNode;
  viewAllSection?: React.ReactNode;
}) {
  return (
    <div className="">
      <div className="grid-row-1 grid grid-flow-row gap-4 lg:grid-flow-col lg:grid-rows-4">
        {children}
      </div>

      {viewAllSection}
    </div>
  );
}

export default ArticleList;
