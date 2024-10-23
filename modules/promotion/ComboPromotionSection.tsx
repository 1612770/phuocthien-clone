import { PropsWithChildren } from 'react';

function ComboPromotionSection({ children }: PropsWithChildren<unknown>) {
  return <section className="container px-2 pb-8 md:px-4 ">{children}</section>;
}

export default ComboPromotionSection;
