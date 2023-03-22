import Script from 'next/script';
export const ZaloChat = () => {
  return (
    <>
      <div className="">
        <div
          className="zalo-chat-widget"
          data-oaid="2698831418754835289"
          data-welcome-message="Rất vui khi được hỗ trợ bạn!"
          data-autopopup="0"
          data-height="300"
          data-width="220"
        ></div>
        <Script src="https://sp.zalo.me/plugins/sdk.js" async></Script>
        <p
          style={{
            color: '#2962ff',
            fontSize: '16px',
            position: 'fixed',
            bottom: '110px',
            right: '60px',
            background: '#fff',
            borderRadius: '10px',
            padding: '3px 10px',
            boxShadow: '0 1px 2px rgba(0,0,0,.25)',
            zIndex: '2147483644',
          }}
        >
          (7h - 21h)
        </p>
      </div>
    </>
  );
};
