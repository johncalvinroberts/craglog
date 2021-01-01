import { TOKEN_KEY, API_BASE_PATH } from './constants';

const GET = 'GET';
const POST = 'POST';
const PATCH = 'PATCH';
const DELETE = 'DELETE';

let token = localStorage.getItem(TOKEN_KEY);

const easyFetch = async ({ url, method, body = {} }) => {
  const headers = {
    'content-type': 'application/json',
    accept: 'application/json, text/plain, */*',
    ...(token ? { authorization: `Bearer ${token}` } : null),
  };

  const options = {
    headers,
    method,
    ...(method !== GET ? { body: JSON.stringify(body) } : null),
  };
  const res = await fetch(API_BASE_PATH + url, options);
  const value = await res.json();
  if (!res.ok) {
    if (res.status === 401 && token) {
      localStorage.removeItem(TOKEN_KEY);
      token = undefined;
    }
    throw value;
  } else {
    return value;
  }
};

const http = {
  get: async (url) => easyFetch({ url, method: GET }),
  post: (url, body) => easyFetch({ url, method: POST, body }),
  patch: (url, body) => easyFetch({ url, method: PATCH, body }),
  delete: (url) => easyFetch({ url, method: DELETE }),
  setToken: (nextToken) => {
    token = nextToken;
    localStorage.setItem(TOKEN_KEY, nextToken);
  },
};

export default http;
