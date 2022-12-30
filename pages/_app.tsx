import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/style.scss';
import 'antd/dist/reset.css';

import { NextPageWithLayout } from './page';
import COLORS from 'configs/colors';
import { GeneralClient } from 'libs/client/General';
import Menu from '@configs/models/menu.model';
import FullMenuProvider from '@providers/FullMenuProvider';
interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout;
  props?: any;
}

function App({ Component, pageProps, props }: AppPropsWithLayout) {
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
        <FullMenuProvider fullMenu={props.fullMenu}>
          {getLayout(<Component {...pageProps} {...props} />)}{' '}
        </FullMenuProvider>
      </ConfigProvider>
    </>
  );
}

App.getInitialProps = async (ctx: any) => {
  let initialProps: { props: { allMenu: Menu[] } } = {
    props: {
      allMenu: [],
    },
  };

  const generalClient = new GeneralClient(ctx, {});

  try {
    const allMenu = await generalClient.getMenu();
    console.log('file: _app.tsx:44 | allMenu', allMenu);

    initialProps.props.allMenu = allMenu.data;
  } catch (error) {
    console.log('file: _app.tsx:50 | error', error);
  }

  return initialProps;
};

export default App;
