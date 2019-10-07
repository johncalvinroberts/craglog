import { API_BASE_PATH } from '../constants';
import http from '../http';

export const postRegistration = (payload) => {
  const url = `${API_BASE_PATH}/users/register`;
  return http.post(url, payload);
};

export const postLogin = async (payload) => {
  const url = `${API_BASE_PATH}/users/login`;
  return http.post(url, payload);
};
