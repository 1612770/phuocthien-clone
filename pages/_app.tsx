import { ConfigProvider } from 'antd';
import type { AppContext, AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/style.scss';
import 'antd/dist/reset.css';

import { NextPageWithLayout } from './page';
import COLORS from 'configs/colors';
import { GeneralClient } from 'libs/client/General';
import Menu from '@configs/models/menu.model';
import FullMenuProvider from '@providers/FullMenuProvider';
import App from 'next/app';
import React from 'react';

interface AppPropsWithLayout<T> extends AppProps<T> {
  Component: NextPageWithLayout<T>;
}

function MyApp({
  Component,
  pageProps,
}: AppPropsWithLayout<{
  fullMenu?: Menu[];
}>) {
  console.log('file: _app.tsx:25 | pageProps', pageProps);

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>Nhà thuốc Phước Thiện</title>
      </Head>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'Roboto',
            colorPrimary: COLORS.primary,
          },
        }}
      >
        <FullMenuProvider fullMenu={pageProps.fullMenu || []}>
          {getLayout(<Component {...pageProps} />)}
        </FullMenuProvider>
      </ConfigProvider>
    </>
  );
}

MyApp.getInitialProps = async (ctx: AppContext) => {
  let initalProps = await App.getInitialProps(ctx);

  let appInitalProps: { props: { fullMenu: Menu[] } } = {
    props: {
      fullMenu: [],
    },
  };

  let generalClient = new GeneralClient(ctx, {});
  try {
    let fullMenu = await generalClient.getMenu();
    console.log('file: _app.tsx:63 | fullMenu', fullMenu);

    appInitalProps.props.fullMenu = fullMenu.data;
  } catch (error) {
    console.log('file: _app.tsx:68 | error', error);

    appInitalProps.props.fullMenu = [];
  }

  initalProps.pageProps = {
    ...initalProps.pageProps,
    ...appInitalProps.props,
  };

  return initalProps;
};

export default MyApp;
