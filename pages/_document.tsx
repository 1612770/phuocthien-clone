import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="vi">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          ></link>
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
          <meta property="og:rich_attachment" content="true" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/favicon/favicon-16x16.png" />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-M15MVM4EXS"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-M15MVM4EXS');
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

export default MyDocument;
