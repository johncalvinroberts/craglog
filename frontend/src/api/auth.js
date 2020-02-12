import http from '@/http';

export const postRegistration = (payload) => {
  return http.post('/user', payload);
};

export const postLogin = async (payload) => {
  return http.post('/user/login', payload);
};
