import { PropsWithChildren } from 'react';

function ComboPromotionnHeader({ children }: PropsWithChildren<unknown>) {
  return <header className="mb-4">{children}</header>;
}

export default ComboPromotionnHeader;
