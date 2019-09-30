import { addReducer } from '../components/State';
import Dashboard from '../layouts/Dashboard';

const stateKey = 'UI';
const initialState = { Layout: Dashboard };

const reducer = (state, action) => {
  return { ...state, ...action };
};

addReducer(stateKey, initialState, reducer);

export const getState = (state) => state[stateKey] || initialState;
