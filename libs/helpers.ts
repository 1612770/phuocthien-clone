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

export function getErrorMessage(
  error: unknown,
  message = 'Lỗi không xác định'
) {
  if (typeof error === 'string') {
    message = error;
  } else if (typeof error !== 'string') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (error as any)?.error?.msg === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message = (error as any).error.msg;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if (Array.isArray((error as any)?.message)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message = (error as any)?.message.join(', ');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if (typeof (error as any)?.message === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message = (error as any).message;
    }
  }

  return message;
}

/**
 * Remove dấu câu from string
 * @param string
 * @returns
 */
export function convertStringToASCII(string: string) {
  string = string || ''.toLowerCase();

  return (string || '')
    .replace(/[àáảãạâầấẩẫậăằắẳẵặ]/g, 'a')
    .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
    .replace(/[đ]/g, 'd')
    .replace(/[ìíỉĩị]/g, 'i')
    .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
    .replace(/[ùúủũụưừứửữự]/g, 'u')
    .replace(/[ỳýỷỹỵ]/g, 'y');
}
