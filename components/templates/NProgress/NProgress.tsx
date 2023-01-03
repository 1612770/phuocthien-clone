import { Router } from 'next/router';
import { ReactNode, useEffect } from 'react';
import NProgressUtil from 'nprogress';

const NProgress = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const handleRouteStart = () => NProgressUtil.start();
    const handleRouteDone = () => NProgressUtil.done();

    NProgressUtil.configure({ showSpinner: false });
    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);

    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);

  return <>{children}</>;
};

export default NProgress;
