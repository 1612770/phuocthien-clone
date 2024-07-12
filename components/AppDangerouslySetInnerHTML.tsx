import React, { forwardRef } from 'react';

const AppDangerouslySetInnerHTML = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function AppDangerouslySetInnerHTMLRefInner(
  props: React.HTMLAttributes<HTMLDivElement>,
  ref
) {
  return (
    <div
      {...props}
      className={`${props.className} app__dangerously-set-inner-html text-lg md:text-base`}
      ref={ref}
    ></div>
  );
});

export default AppDangerouslySetInnerHTML;
