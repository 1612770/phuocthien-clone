import useIsMobile from '@libs/utils/hooks/use-is-mobile';
import useIsMounted from '@libs/utils/hooks/use-is-mounted';
import Script from 'next/script';
import { memo } from 'react';

const ZaloChat = () => {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  if (isMobile) {
    return null;
  }

  return (
    <div>
      <div className="app__zalo-chat-widget-container">
        <div
          className="zalo-chat-widget"
          data-oaid="2698831418754835289"
          data-welcome-message="Rất vui khi được hỗ trợ bạn!"
          data-autopopup="0"
          data-height="300"
          data-width="220"
        ></div>
        <Script
          className="hidden md:block"
          async
          src="https://sp.zalo.me/plugins/sdk.js"
          strategy="lazyOnload"
          onReady={() => {
            const iframe = document.querySelector(
              '.zalo-chat-widget iframe'
            ) as HTMLIFrameElement | null;
            if (iframe) {
              iframe.title = 'Zalo Chat Widget';
            }
          }}
        ></Script>
        <p className="zalo-chat-widget-time hidden md:block">(7h - 21h)</p>
      </div>
    </div>
  );
};

export default memo(ZaloChat);
