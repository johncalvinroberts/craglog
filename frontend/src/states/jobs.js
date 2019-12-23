import { addReducer } from '../components/State';
import merge from '../utils/merge';
import { fetchJobs, fetchJobsCount } from '../api';

const stateKey = 'jobs';

const initialState = {
  countData: {
    isLoading: false,
    data: null,
  },
  routes: {
    isLoading: false,
    data: null,
  },
  lists: {
    isLoading: false,
    data: null,
  },
};

addReducer(stateKey, initialState, merge);

export const getState = (state) => state[stateKey] || initialState;

export const getRouteJobs = (params) => async (dispatch) => {
  dispatch({ [stateKey]: { routes: { isLoading: true } } });
  const res = await fetchJobs(params);
  dispatch({ [stateKey]: { routes: { isLoading: false, data: res } } });
};

export const getListJobs = (params) => async (dispatch) => {
  dispatch({ [stateKey]: { lists: { isLoading: true } } });
  const res = await fetchJobs(params);
  dispatch({ [stateKey]: { lists: { isLoading: false, data: res } } });
};

export const getCountData = () => async (dispatch) => {
  dispatch({ [stateKey]: { countData: { isLoading: true } } });
  const res = await fetchJobsCount();
  dispatch({ [stateKey]: { countData: { isLoading: false, data: res } } });
};
