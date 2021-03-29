import http from '../http';

export const postRegistration = (payload) => {
  return http.post('/user', payload);
};

export const postLogin = async (payload) => {
  return http.post('/user/login', payload);
};

export const requestPasswordReset = (payload) =>
  http.post(`/user/forgot-password`, payload);

export const submitPasswordReset = (payload) =>
  http.post(`/user/reset-password`, payload);
