import { addReducer } from '../components/State';

const stateKey = 'UI';
const initialState = { Title: 'craglog' };

const reducer = (state, action) => {
  return { ...state, ...action };
};

addReducer(stateKey, initialState, reducer);

export const getState = (state) => state[stateKey] || initialState;
