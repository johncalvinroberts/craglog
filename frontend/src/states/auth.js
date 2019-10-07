import decodeJwt from 'jwt-decode';
import { addReducer } from '../components/State';
import { postRegistration, postLogin } from '../api';
import http from '../http';
import { TOKEN_KEY } from '../constants';

const stateKey = 'auth';

const getInitialState = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = token ? decodeJwt(token) : {};
  return {
    isAuthenticated: Boolean(token),
    token,
    isLoading: false,
    user,
    errors: [],
  };
};

const initialState = getInitialState();

const reducer = (state, payload) => ({ ...state, ...payload });

addReducer(stateKey, initialState, reducer);

export const getState = (state) => state[stateKey] || initialState;

export const performRegistration = (payload) => async (dispatch) => {
  dispatch({ [stateKey]: { isLoading: true } });
  try {
    const res = await postRegistration(payload);
    dispatch({ [stateKey]: { isLoading: false } });
    return res;
  } catch (error) {
    dispatch({
      [stateKey]: { isLoading: false, isAuthenticated: false, errors: [error] },
    });
    throw error;
  }
};

export const performLogin = (payload) => async (dispatch) => {
  dispatch({ [stateKey]: { isLoading: true } });
  try {
    const { jwt } = await postLogin(payload);
    http.setToken(jwt);
    localStorage.setItem(TOKEN_KEY, jwt);
    const user = decodeJwt(jwt);
    dispatch({
      [stateKey]: {
        isLoading: false,
        isAuthenticated: true,
        user,
        token: jwt,
      },
    });
    return jwt;
  } catch (error) {
    dispatch({
      [stateKey]: { isLoading: false, isAuthenticated: false, errors: [error] },
    });
    throw error;
  }
};

export const performLogout = () => (dispatch) => {
  http.setToken(null);
  localStorage.removeItem(TOKEN_KEY);
  dispatch({ [stateKey]: { isAuthenticated: false, user: {}, token: null } });
};
