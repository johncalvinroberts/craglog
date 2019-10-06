import { addReducer } from '../components/State';
import { postRegistration } from '../api';

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

export const performRegistration = (payload) => async (dispatch) => {
  dispatch({ [stateKey]: { isLoading: true } });
  try {
    const res = await postRegistration(payload);
    console.log({ res });
    dispatch({ [stateKey]: { isLoading: false, isAuthenticated: true } });
    return res;
  } catch (error) {
    dispatch({
      [stateKey]: { isLoading: false, isAuthenticated: false, errors: [error] },
    });
    throw error;
  }
};
