import { PropsWithChildren } from 'react';

function ComboPromotionSection({ children }: PropsWithChildren<unknown>) {
  return <section className="container py-8">{children}</section>;
}

export default ComboPromotionSection;
