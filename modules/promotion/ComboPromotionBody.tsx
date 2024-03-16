import { PropsWithChildren } from 'react';

function ComboPromotionBody({ children }: PropsWithChildren<unknown>) {
  return <div className="my-4">{children}</div>;
}

export default ComboPromotionBody;
