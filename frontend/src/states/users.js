import { addReducer } from '../components/State';
import merge from '@/utils/merge';
import { fetchUsers } from '@/api';

const stateKey = 'users';

const initialState = {
  isLoading: false,
  data: null,
  skip: 0,
  limit: 25,
};

addReducer(stateKey, initialState, merge);

export const getUsers = () => async (dispatch, getState) => {
  const state = getState();
  const { [stateKey]: { skip, limit } = initialState } = state;
  dispatch({ [stateKey]: { isLoading: true } });
  const res = await fetchUsers({ skip, limit });
  dispatch({ [stateKey]: { data: res, isLoading: false } });
};
