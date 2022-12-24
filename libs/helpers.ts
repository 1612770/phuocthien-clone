import { getCookie, setCookie } from 'cookies-next';

export const getSessionToken = (
  ctx: any,
  cookieName: any = 'session_token'
) => {
  if (ctx) {
    // get from server side
    return getCookie(cookieName, ctx);
  } else {
    // client side
    return getCookie(cookieName);
  }
};

export const setSessionToken = (
  ctx: any,
  value: any,
  cookieName: any = 'session_token'
) => {
  if (ctx) {
    setCookie(cookieName, value, ctx);
  } else {
    setCookie(cookieName, value);
  }
};
