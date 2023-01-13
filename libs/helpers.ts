import { getCookie as _getCookie, setCookie as _setCookie } from 'cookies-next';

export enum COOKIE_KEYS {
  TOKEN = 'token',
}

export const getCookie = (ctx: unknown, cookieName = COOKIE_KEYS.TOKEN) => {
  if (ctx) return _getCookie(cookieName, ctx);
  else return _getCookie(cookieName);
};

export const setCookie = (
  ctx: unknown,
  value: unknown,
  cookieName = COOKIE_KEYS.TOKEN
) => {
  if (ctx) _setCookie(cookieName, value, ctx);
  else _setCookie(cookieName, value);
};
