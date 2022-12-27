import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/style.scss';
import 'antd/dist/reset.css';

import { NextPageWithLayout } from './page';
import COLORS from 'configs/colors';
import { GeneralClient } from 'libs/client/General';
import { getLogger } from '@libs/pino';
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
        {getLayout(<Component {...pageProps} {...props} />)}{' '}
      </ConfigProvider>
    </>
  );
}

App.getInitialProps = async (ctx: any) => {
  let returnObject: { props: any } = { props: {} };
  const generalClient = new GeneralClient(ctx, {});
  try {
    const _res = await generalClient.getAllMenu();
    if (_res.success) {
      returnObject.props.fullMenu = _res.data;
    }
  } catch (error) {
    getLogger('production').error(error);
  }
  return returnObject;
};

export default App;
