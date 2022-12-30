/* eslint-disable no-prototype-builtins */
import APIResponse from '@configs/types/api-response.type';
import { getSessionToken } from 'libs/helpers';

export function serialize(obj: any) {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
}

// handle base client
class BaseClient {
  ctx: any;
  data: any;
  session: any;
  contentType: any;

  constructor(ctx: any, data: any) {
    this.ctx = ctx || null;
    this.data = data;
    this.data.props = data.props || {};
    this.session = data.session || getSessionToken(ctx)?.toString();
  }
  async makeRequest(
    method: string,
    url: string,
    data: any
  ): Promise<APIResponse> {
    let req: any = {
      method: method,
    };
    req.headers = {
      ...req.headers,
      'Content-Type': this.contentType || 'application/json',
    };

    if (data) {
      if (method == 'GET' || method == 'DELETE') {
        url = url + '?' + serialize(data);
      } else {
        req.body = JSON.stringify(data);
      }
    }

    // make call
    let resp = await fetch(url, req);

    let result = await resp.json();

    return result;
  }

  async call(method: string, url: string, data: any): Promise<APIResponse> {
    return typeof window === 'undefined'
      ? await this.makeRequest(
          method,
          `${process.env.API_HOST}/${process.env.API_VERSION}/${url}`,
          data
        )
      : await this.makeRequest(method, '/backend' + url, data);
  }
}

export default BaseClient;
