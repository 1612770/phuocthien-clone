import { ConfigProvider, App as AntdApp } from 'antd';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import 'antd/dist/reset.css';
import '../styles/style.scss';
import 'nprogress/nprogress.css';
import '../styles/_ckedit.scss';

import { NextPageWithLayout } from './page';
import COLORS from 'configs/colors';
import MenuModel from '@configs/models/menu.model';
import FullMenuProvider from '@providers/FullMenuProvider';
import React, { Suspense } from 'react';
import CartProvider from '@providers/CartProvider';
import AppMessageProvider from '@providers/AppMessageProvider';
import AuthProvider from '@providers/AuthProvider';
import AppConfirmDialogProvider from '@providers/AppConfirmDialogProvider';
import FocusContentModel from '@configs/models/focus-content.model';
import AppDataProvider from '@providers/AppDataProvider';
import { ZaloChat } from '@modules/zaloChat';
import NProgress from '@components/templates/NProgress';

const DEFAUT_PAGE_TITLE = 'Nhà thuốc Phước Thiện';

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
  };
}>) {
  const getLayout = Component.getLayout || ((page) => page);
  const titleSeo = pageProps?.SEOData?.titleSeo || DEFAUT_PAGE_TITLE;
  const metaSeo = pageProps?.SEOData?.metaSeo ? (
    <meta name="description" content={pageProps?.SEOData?.metaSeo} />
  ) : null;
  const keywordSeo = pageProps?.SEOData?.keywordSeo ? (
    <meta name="keywords" content={pageProps?.SEOData?.keywordSeo} />
  ) : null;

  return (
    <>
      <Head>
        <title>{titleSeo}</title>
        {metaSeo}
        {keywordSeo}
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <NProgress>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: 'Inter',
              colorPrimary: COLORS.primary,
            },
          }}
        >
          <AntdApp>
            <AppMessageProvider>
              <AppConfirmDialogProvider>
                <AuthProvider>
                  <CartProvider>
                    <FullMenuProvider>
                      <AppDataProvider>
                        {getLayout(<Component {...pageProps} />)}
                      </AppDataProvider>
                    </FullMenuProvider>
                  </CartProvider>
                </AuthProvider>
              </AppConfirmDialogProvider>
            </AppMessageProvider>
          </AntdApp>
        </ConfigProvider>
      </NProgress>
      <Suspense>
        <ZaloChat />
      </Suspense>
    </>
  );
}

export default MyApp;
