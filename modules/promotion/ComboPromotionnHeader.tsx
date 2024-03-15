import { PropsWithChildren } from 'react';

function ComboPromotionnHeader({ children }: PropsWithChildren<unknown>) {
  return <header className="my-4">{children}</header>;
}

export default ComboPromotionnHeader;
