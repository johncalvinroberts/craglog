import http from '../http';

export const postRegistration = (payload) => {
  return http.post('/users/register', payload);
};

export const postLogin = async (payload) => {
  return http.post('/users/login', payload);
};
