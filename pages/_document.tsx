import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="vi">
        <Head>
          <meta name="author" content="nhathuocphuocthien.com" />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon/favicon-16x16.png"
          />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
          <meta name="copyright" content="nhathuocphuocthien.com" />
          <meta name="revisit-after" content="days" />
          <meta property="og:site_name" content="nhathuocphuocthien.com" />
          <meta property="og:rich_attachment" content="true" />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="vi_VN" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-title"
            content="nhathuocphuocthien.com"
          />

          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-M15MVM4EXS"
            strategy="beforeInteractive"
          />
          <Script async id="google-analytics" strategy="beforeInteractive">
            {`setTimeout(()=>{
                window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-M15MVM4EXS');
            },5000)
        `}
          </Script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        (
          <StyleProvider cache={cache}>
            <App {...props} />
          </StyleProvider>
        ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default MyDocument;
