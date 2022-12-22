import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/style.scss';
import { NextPageWithLayout } from './page';
interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout;
}
export default function App({ Component, pageProps }: AppPropsWithLayout) {
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
          },
        }}
      >
        {getLayout(<Component {...pageProps} />)}{' '}
      </ConfigProvider>
    </>
  );
}
