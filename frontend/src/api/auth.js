import { API_BASE_URL } from '../constants';
import http from '../http';

export const postRegistration = (payload) => {
  const url = `${API_BASE_URL}/users/register`;
  return http.post(url, payload);
};
