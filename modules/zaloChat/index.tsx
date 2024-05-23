import Script from 'next/script';
import { useEffect, useState } from 'react';
export const ZaloChat = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 5000);
  }, []);

  if (!mounted) return null;

  return (
    <>
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
          src="https://sp.zalo.me/plugins/sdk.js"
          async
          onLoad={() => {
            setTimeout(() => {
              const iframe = document.querySelector(
                '.zalo-chat-widget iframe'
              ) as HTMLIFrameElement | null;
              if (iframe) {
                iframe.title = 'Zalo Chat Widget';
              }
            });
          }}
        ></Script>
        <p className="zalo-chat-widget-time">(7h - 21h)</p>
      </div>
    </>
  );
};

export default ZaloChat;
