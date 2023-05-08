import { ConfigProvider, App as AntdApp } from 'antd';
import type { AppContext, AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/style.scss';
import 'antd/dist/reset.css';
import 'nprogress/nprogress.css';

import { NextPageWithLayout } from './page';
import COLORS from 'configs/colors';
import { GeneralClient } from 'libs/client/General';
import MenuModel from '@configs/models/menu.model';
import FullMenuProvider from '@providers/FullMenuProvider';
import App from 'next/app';
import React, { Suspense } from 'react';
import NProgress from '@components/templates/NProgress';
import CartProvider from '@providers/CartProvider';
import AppMessageProvider from '@providers/AppMessageProvider';
import AuthProvider from '@providers/AuthProvider';
import AppConfirmDialogProvider from '@providers/AppConfirmDialogProvider';
import FocusContentModel from '@configs/models/focus-content.model';
import AppDataProvider from '@providers/AppDataProvider';
import { ZaloChat } from '@modules/zaloChat';
import MainInfoModel from '@configs/models/main-info.model';

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
}>) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>Nhà thuốc Phước Thiện</title>
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
      </NProgress>
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

  const [fullMenu, focusContent, mainInfoFooter] = await Promise.allSettled([
    generalClient.getMenu(),
    generalClient.getFocusContent(),
    generalClient.getMainInfos({
      page: 1,
      pageSize: 10,
      mainInfoCode: 1,
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
