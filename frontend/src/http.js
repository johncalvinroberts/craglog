import { TOKEN_KEY, API_BASE_PATH } from './constants';

const GET = 'GET';
const POST = 'POST';
const PATCH = 'PATCH';
const DELETE = 'DELETE';

// TODO: refactor to use Proxy
class Http {
  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY);
  }

  setToken = (token) => {
    this.token = token;
  };

  fetch = async ({ url, method, body = {} }) => {
    const headers = {
      'content-type': 'application/json',
      accept: 'application/json, text/plain, */*',
      ...(this.token ? { authorization: `Bearer ${this.token}` } : null),
    };

    const options = {
      headers,
      method,
      ...(method !== GET ? { body: JSON.stringify(body) } : null),
    };
    const res = await fetch(API_BASE_PATH + url, options);
    const value = await res.json();
    if (!res.ok) {
      throw new Error(value.message);
    } else {
      return value;
    }
  };

  get = async (url) => this.fetch({ url, method: GET });

  post = (url, body) => this.fetch({ url, method: POST, body });

  patch = (url, body) => this.fetch({ url, method: PATCH, body });

  delete = (url) => this.fetch({ url, method: DELETE });
}

export default new Http();
