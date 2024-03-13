import { PropsWithChildren } from 'react';

function ComboPromotionSection({ children }: PropsWithChildren<unknown>) {
  return <section className="container px-4 py-8 md:px-0">{children}</section>;
}

export default ComboPromotionSection;
