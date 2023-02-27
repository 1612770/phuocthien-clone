import { ConfigProvider } from 'antd';
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
import React from 'react';
import NProgress from '@components/templates/NProgress';
import CartProvider from '@providers/CartProvider';
import AppMessageProvider from '@providers/AppMessageProvider';
import AuthProvider from '@providers/AuthProvider';
import AppConfirmDialogProvider from '@providers/AppConfirmDialogProvider';
import FocusContentModel from '@configs/models/focus-content.model';
import FocusContentProvider from '@providers/FocusContentProvider';

interface AppPropsWithLayout<T> extends AppProps<T> {
  Component: NextPageWithLayout<T>;
}

function MyApp({
  Component,
  pageProps,
}: AppPropsWithLayout<{
  fullMenu?: MenuModel[];
  focusContent?: FocusContentModel[];
}>) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>Nhà thuốc Phước Thiện</title>
      </Head>
      <NProgress>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: 'Roboto',
              colorPrimary: COLORS.primary,
            },
          }}
        >
          <AppMessageProvider>
            <AppConfirmDialogProvider>
              <AuthProvider>
                <CartProvider>
                  <FullMenuProvider fullMenu={pageProps.fullMenu || []}>
                    <FocusContentProvider
                      focusContent={pageProps.focusContent || []}
                    >
                      {getLayout(<Component {...pageProps} />)}
                    </FocusContentProvider>
                  </FullMenuProvider>
                </CartProvider>
              </AuthProvider>
            </AppConfirmDialogProvider>
          </AppMessageProvider>
        </ConfigProvider>
      </NProgress>
    </>
  );
}

MyApp.getInitialProps = async (ctx: AppContext) => {
  const initalProps = await App.getInitialProps(ctx);

  const appInitalProps: {
    props: { fullMenu: MenuModel[]; focusContent: FocusContentModel[] };
  } = {
    props: {
      fullMenu: [],
      focusContent: [],
    },
  };

  const generalClient = new GeneralClient(ctx, {});

  try {
    const [fullMenu, focusContent] = await Promise.all([
      generalClient.getMenu(),
      generalClient.getFocusContent(),
    ]);

    if (fullMenu.data) {
      appInitalProps.props.fullMenu = fullMenu.data;
    }
    if (focusContent.data) {
      appInitalProps.props.focusContent = focusContent.data || [];
    }
  } catch (error) {
    console.error(error);
    appInitalProps.props.fullMenu = [];
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
