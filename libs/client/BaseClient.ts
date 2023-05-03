/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
import APIResponse from '@configs/types/api-response.type';
import { COOKIE_KEYS, getCookie } from 'libs/helpers';

export function serialize(obj: any) {
  const str = [];
  for (const p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
}

// handle base client
class BaseClient {
  ctx: any;
  data: any;
  token: any;
  contentType: any;

  constructor(ctx: any, data: any) {
    this.ctx = ctx || null;
    this.data = data;
    this.data.props = data.props || {};
    this.token = data.token || getCookie(ctx, COOKIE_KEYS.TOKEN)?.toString();
  }
  async makeRequest(
    method: string,
    url: string,
    data: any
  ): Promise<APIResponse> {
    // eslint-disable-next-line no-console
    console.log('file: BaseClient.ts:33| method:', url);

    const req: any = {
      method: method,
    };

    req.headers = {
      ...req.headers,
      'Content-Type': this.contentType || 'application/json',
    };

    if (this.token) {
      req.headers = {
        ...req.headers,
        'api-tk': this.token,
      };
    }

    if (data) {
      if (method == 'GET' || method == 'DELETE') {
        url = url + '?' + serialize(data);
      } else {
        Object.keys(data).forEach((key) => {
          if (typeof data[key] === 'string') {
            data[key] = data[key].trim();
          }
        });

        req.body = JSON.stringify(data);
      }
    }

    // make call
    const resp = await fetch(url, req);
    if (!resp.ok) {
      throw resp.statusText;
    }

    const result = await resp.json();

    if (result.error) {
      throw result;
    }

    return result;
  }

  async call(method: string, url: string, data: any): Promise<APIResponse> {
    return typeof window === 'undefined'
      ? await this.makeRequest(
          method,
          `${process.env.API_HOST}/${process.env.MS_PATH}/${url}`,
          data
        )
      : await this.makeRequest(method, '/backend/' + url, data);
  }
}

export default BaseClient;
