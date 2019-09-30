import { addReducer } from '../components/State';

const stateKey = 'notifications';

const initialState = [];

function notificationsReducer(state, action) {
  if (action.dismiss) return state.filter((v) => v.id !== action.id);

  return [...state, action];
}

addReducer(stateKey, initialState, notificationsReducer);

export const getState = (state) => state[stateKey] || initialState;

export const addNotification = ({
  key: id = new Date().getTime() + Math.random(),
  variant = 'default',
  isPersistent = false,
  timeout = 3000,
  message,
}) => {
  return {
    [stateKey]: { id, variant, isPersistent, timeout, message },
  };
};

export const notifyError = (error) => {
  const message = error.message || JSON.stringify(error);

  return addNotification({ message, variant: 'error', isPersistent: true });
};

export const removeNotification = (id) => {
  return { [stateKey]: { dismiss: true, id } };
};
