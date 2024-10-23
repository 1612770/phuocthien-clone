import { PropsWithChildren } from 'react';

function ComboPromotionnHeader({ children }: PropsWithChildren<unknown>) {
  return (
    <header
      className="border-1 -mx-2 my-0 rounded-none border-primary-light bg-white p-4  uppercase shadow-md md:mx-0 md:my-4 md:rounded-lg"
      style={{
        backgroundImage:
          'url(https://thumb.ac-illust.com/84/84ac8cc4be96410b0ca80aa2ff15d2ff_t.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {children}
    </header>
  );
}

export default ComboPromotionnHeader;
