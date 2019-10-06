import { TOKEN_KEY, CACHE_LIMIT } from './constants';

const GET = 'GET';
const POST = 'POST';
const PATCH = 'PATCH';
const DELETE = 'DELETE';

class Http {
  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY);
    this.defaultHeader = {
      'content-type': 'application/json',
      accept: 'application/json, text/plain, */*',
    };
    this.cache = {};
  }

  setToken = (token) => {
    this.token = token;
  };

  fetch = async ({ url, method, body }) => {
    const options = {
      headers: { ...this.defaultHeader },
      method,
      ...(method !== GET ? { body } : null),
    };
    const res = await fetch(url, options);
    const value = await res.json();
    if (!res.ok) {
      throw new Error(value);
    } else {
      return value;
    }
  };

  get = async (url) => {
    const now = new Date().valueOf();
    const cached = this.cache[url];
    if (cached && now - cached.fetchedAt > CACHE_LIMIT) {
      return cached.res;
    }
    const res = await this.fetch({ url, method: GET });
    this.cache = {
      ...this.cache,
      [url]: { fetchedAt: new Date().valueOf(), res },
    };
    return res;
  };

  post = (url, body) => {
    return this.fetch({ url, method: POST, body });
  };

  patch = (url, body) => {
    return this.fetch({ url, method: PATCH, body });
  };

  delete = (url) => {
    return this.fetch({ url, method: DELETE });
  };
}

export default new Http();
