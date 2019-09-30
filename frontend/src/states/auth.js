import { addReducer } from '../components/State';

const stateKey = 'auth';
const initialState = {
  isAuthenticated: false,
  token: null,
  isLoading: false,
  errors: [],
};

const reducer = (state, payload) => ({ ...state, ...payload });

addReducer(stateKey, initialState, reducer);

export const getState = (state) => state[stateKey] || initialState;

export const performAuth = (payload) => async (dispatch) => {
  dispatch({ [stateKey]: { isLoading: true } });
  console.log({ payload });
};
