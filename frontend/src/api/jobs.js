import { API_BASE_PATH } from '../constants';
import http from '../http';

export const fetchJobs = (params) => {
  const query = new URLSearchParams(params);
  return http.get(`${API_BASE_PATH}/jobs?${query.toString()}`);
};

export const fetchJobsCount = () => {
  return http.get(`${API_BASE_PATH}/jobs/count`);
};

export const postJob = (payload) => {
  return http.post(`${API_BASE_PATH}/jobs`, payload);
};

export const updateJob = ({ id, ...payload }) => {
  return http.patch(`${API_BASE_PATH}/jobs/${id}`, payload);
};

export const updateQueue = (payload) => {
  return http.patch(`${API_BASE_PATH}/jobs/queue`, payload);
};

export const fetchJobById = ({ id, type = 'route' }) => {
  return http.get(`${API_BASE_PATH}/jobs/${id}?type=${type}`);
};
