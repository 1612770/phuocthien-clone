import { ConfigProvider, App as AntdApp } from 'antd';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import '../styles/style.scss';
import 'nprogress/nprogress.css';
import '../styles/_ckedit.scss';

import { NextPageWithLayout } from './page';
import COLORS from 'configs/colors';
import MenuModel from '@configs/models/menu.model';
import FocusContentModel from '@configs/models/focus-content.model';
import { useRouter } from 'next/router';
import { HOST } from '@configs/env';

const DEFAUT_PAGE_TITLE = 'Nhà thuốc Phước Thiện';

const ZaloChat = dynamic(() => import('../modules/zaloChat/index'), {
  ssr: false,
});

const NProgress = dynamic(() => import('../components/templates/NProgress'), {
  ssr: false,
});
const AppDataProvider = dynamic(() => import('../providers/AppDataProvider'), {
  ssr: false,
});
const AuthProvider = dynamic(() => import('../providers/AuthProvider'), {
  ssr: false,
});
const CartProvider = dynamic(() => import('../providers/CartProvider'), {
  ssr: false,
});
const AppMessageProvider = dynamic(
  () => import('../providers/AppMessageProvider'),
  {
    ssr: false,
  }
);
const AppConfirmDialogProvider = dynamic(
  () => import('../providers/AppConfirmDialogProvider'),
  {
    ssr: false,
  }
);

interface AppPropsWithLayout<T> extends AppProps<T> {
  Component: NextPageWithLayout<T>;
}

function MyApp({
  Component,
  pageProps,
}: AppPropsWithLayout<{
  fullMenu?: MenuModel[];
  focusContent?: FocusContentModel[];
  SEOData?: {
    titleSeo?: string;
    metaSeo?: string;
    keywordSeo?: string;
    imgSeo?: string;
  };
}>) {
  const getLayout = Component.getLayout || ((page) => page);
  const titleSeo = pageProps?.SEOData?.titleSeo || DEFAUT_PAGE_TITLE;
  const metaSeo = pageProps?.SEOData?.metaSeo ? (
    <>
      <meta property="og:description" content={pageProps?.SEOData?.metaSeo} />
      <meta name="description" content={pageProps?.SEOData?.metaSeo} />
    </>
  ) : null;
  const keywordSeo = pageProps?.SEOData?.keywordSeo ? (
    <>
      <meta name="keywords" content={pageProps?.SEOData?.keywordSeo} />
      <meta name="news_keywords" content={pageProps?.SEOData?.keywordSeo} />
    </>
  ) : null;
  const imgSeo = pageProps.SEOData?.imgSeo ? (
    <meta property="og:image" content={pageProps.SEOData?.imgSeo} />
  ) : null;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{titleSeo}</title>
        <meta property="og:title" content={titleSeo} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=1"
        />
        <meta
          name="robots"
          content="max-image-preview:large,  noarchive, index, follow"
        />
        <meta
          property="og:url"
          itemProp="url"
          content={`${HOST}${router.asPath.split('?')[0]}`}
        />
        {imgSeo}
        <link
          rel="alternate"
          href={`${HOST}${router.asPath.split('?')[0]}`}
          hrefLang="vi-vn"
        />
        <link rel="canonical" href={`${HOST}${router.asPath.split('?')[0]}`} />
        {router.asPath !== '/' && (
          <link
            rel="amphtml"
            href={`${HOST}${router.asPath.split('?')[0]}.amp`}
          />
        )}
        {metaSeo}
        {keywordSeo}
      </Head>
      <NProgress>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: 'Inter',
              colorPrimary: COLORS.primary,
            },
            components: {
              Collapse: {
                contentPadding: 0,
              },
            },
          }}
        >
          <AntdApp>
            <AppMessageProvider>
              <AppConfirmDialogProvider>
                <AuthProvider>
                  <CartProvider>
                    <AppDataProvider>
                      {getLayout(<Component {...pageProps} />)}
                    </AppDataProvider>
                  </CartProvider>
                </AuthProvider>
              </AppConfirmDialogProvider>
            </AppMessageProvider>
          </AntdApp>
        </ConfigProvider>
      </NProgress>
      <ZaloChat />
    </>
  );
}

export default MyApp;
