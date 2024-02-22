import { ConfigProvider, App as AntdApp } from 'antd';
import type { AppContext, AppProps } from 'next/app';
import Head from 'next/head';

import 'antd/dist/reset.css';
import '../styles/style.scss';

import { NextPageWithLayout } from './page';
import COLORS from 'configs/colors';
import { GeneralClient } from 'libs/client/General';
import MenuModel from '@configs/models/menu.model';
import FullMenuProvider from '@providers/FullMenuProvider';
import App from 'next/app';
import React, { Suspense } from 'react';
import AppLoading from '@components/templates/AppLoading';
import CartProvider from '@providers/CartProvider';
import AppMessageProvider from '@providers/AppMessageProvider';
import AuthProvider from '@providers/AuthProvider';
import AppConfirmDialogProvider from '@providers/AppConfirmDialogProvider';
import FocusContentModel from '@configs/models/focus-content.model';
import AppDataProvider from '@providers/AppDataProvider';
import { ZaloChat } from '@modules/zaloChat';
import MainInfoModel from '@configs/models/main-info.model';

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
  mainInfoFooter?: MainInfoModel[];
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
      <AppLoading>
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
                    <FullMenuProvider fullMenu={pageProps.fullMenu || []}>
                      <AppDataProvider
                        mainInfoFooter={pageProps.mainInfoFooter || []}
                        focusContent={pageProps.focusContent || []}
                      >
                        {getLayout(<Component {...pageProps} />)}
                      </AppDataProvider>
                    </FullMenuProvider>
                  </CartProvider>
                </AuthProvider>
              </AppConfirmDialogProvider>
            </AppMessageProvider>
          </AntdApp>
        </ConfigProvider>
      </AppLoading>
      <Suspense>
        <ZaloChat />
      </Suspense>
    </>
  );
}

MyApp.getInitialProps = async (ctx: AppContext) => {
  const initalProps = await App.getInitialProps(ctx);

  const appInitalProps: {
    props: {
      fullMenu: MenuModel[];
      focusContent: FocusContentModel[];
      mainInfoFooter: MainInfoModel[];
    };
  } = {
    props: {
      fullMenu: [],
      focusContent: [],
      mainInfoFooter: [],
    },
  };

  const generalClient = new GeneralClient(ctx, {});

  const [fullMenu, focusContent, mainInfoFooter, mainInfoFooterOther] =
    await Promise.allSettled([
      generalClient.getMenu(),
      generalClient.getFocusContent(),
      generalClient.getMainInfos({
        page: 1,
        pageSize: 10,
        mainInfoCode: 1,
      }),
      generalClient.getMainInfos({
        page: 1,
        pageSize: 10,
        mainInfoCode: 4,
      }),
    ]);

  if (fullMenu.status === 'fulfilled' && fullMenu.value.data) {
    appInitalProps.props.fullMenu = fullMenu.value.data;
  }
  if (focusContent.status === 'fulfilled' && focusContent.value.data) {
    appInitalProps.props.focusContent = focusContent.value.data || [];
  }

  if (mainInfoFooter.status === 'fulfilled' && mainInfoFooter.value.data) {
    appInitalProps.props.mainInfoFooter = mainInfoFooter.value.data || [];
  }

  if (
    mainInfoFooterOther.status === 'fulfilled' &&
    mainInfoFooterOther.value.data
  ) {
    appInitalProps.props.mainInfoFooter = [
      ...appInitalProps.props.mainInfoFooter,
      ...mainInfoFooterOther.value.data,
    ];
  }
  initalProps.pageProps = {
    ...initalProps.pageProps,
    ...appInitalProps.props,
  };

  if (ctx.ctx.req) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ctx.ctx.req as any)._fromAppData = {
      fullMenu: appInitalProps.props.fullMenu,
    };
  }

  return initalProps;
};

export default MyApp;
