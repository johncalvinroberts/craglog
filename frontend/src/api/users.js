import { API_BASE_PATH } from '../constants';
import http from '../http';

export const fetchUsers = (params, refetch) => {
  const query = new URLSearchParams(params);
  return http.get(`${API_BASE_PATH}/users?${query.toString()}`, refetch);
};

export const fetchUsersCount = () => {
  return http.get(`${API_BASE_PATH}/users/count`, true);
};
