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

interface AppPropsWithLayout<T> extends AppProps<T> {
  Component: NextPageWithLayout<T>;
}

function MyApp({
  Component,
  pageProps,
}: AppPropsWithLayout<{
  fullMenu: Menu[];
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
        <FullMenuProvider fullMenu={pageProps.fullMenu}>
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

  if (typeof window === 'undefined') {
    let generalClient = new GeneralClient(ctx, {});
    try {
      let fullMenu = await generalClient.getMenu();
      console.log('file: _app.tsx:44 | fullMenu', fullMenu);

      appInitalProps.props.fullMenu = fullMenu.data;
    } catch (error) {
      appInitalProps.props.fullMenu = [];
      console.log('file: _app.tsx:50 | error', error);
    }
  }

  initalProps.pageProps = {
    ...initalProps.pageProps,
    ...appInitalProps.props,
  };

  return initalProps;
};

export default MyApp;
