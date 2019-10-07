import { API_BASE_URL } from '../constants';
import http from '../http';

export const postRegistration = (payload) => {
  const url = `/api/users/register`;
  return http.post(url, payload);
};
