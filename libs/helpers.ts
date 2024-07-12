import Product from '@configs/models/product.model';
import APIResponse from '@configs/types/api-response.type';
import { getCookie as _getCookie, setCookie as _setCookie } from 'cookies-next';
import parse from 'html-react-parser';

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

export function getVisibleItems<T extends { visible?: boolean }>(array: T[]) {
  return array.filter(
    // filter out all items has visible === false
    (item) => !(typeof item?.visible === 'boolean' && !item?.visible)
  );
}

export const loadAll = async <T>(
  loadFunc: (params: {
    offset: number;
    limit: number;
  }) => Promise<APIResponse<T[]>>
) => {
  const limit = 50;
  let result: T[] = [];

  const _result = await loadFunc({ offset: 0, limit });

  const total = _result.total || 0;

  const promisesByOffset = Array.from(
    { length: Math.ceil(total / limit) },
    (_, index) => {
      return loadFunc({ offset: index * limit, limit });
    }
  );

  const results = await Promise.all(promisesByOffset);

  results.forEach((res) => {
    if (res.data) {
      result = [...result, ...res.data];
    }
  });

  return result;
};

export function getAvatarCharacters(name?: string) {
  if (!name) return '';
  let returnName = '';

  const nameArray = name.split(' ');
  if (nameArray.length === 1) returnName = nameArray[0][0];

  returnName = `${nameArray[0][0]}${nameArray[nameArray.length - 1][0]}`;

  return returnName.toUpperCase();
}

export function convertFromStringToHTML(text: string) {
  return parse(text);
}

export const getProductName = (product?: Product) => {
  return product?.detail?.displayName || product?.name;
};
