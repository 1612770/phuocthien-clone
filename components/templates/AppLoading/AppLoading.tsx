import { Spin } from 'antd';
import { Router } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import css from './Apploading.module.scss';

function BackdropSpin({ spinning }: { spinning: boolean }) {
  if (!spinning) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[2147483645] flex items-center justify-center bg-black bg-opacity-50"
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <Spin spinning={true} className={css.spin} />
    </div>
  );
}

const AppLoading = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteStart = () => {
      setLoading(true);
    };

    const handleRouteDone = () => {
      setLoading(false);
    };

    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);

    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);

  return (
    <>
      <BackdropSpin spinning={loading} />
      {children}
    </>
  );
};

export default AppLoading;
