import React, { createContext, useReducer } from 'react';
import Dashboard from '../layouts/Dashboard';

export const UIContext = createContext();

const reducer = (state, action) => {
  return { ...state, ...action };
};

const UIProvider = ({ children }) => {
  const initialState = { Layout: Dashboard };
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UIContext.Provider value={{ dispatch, state }}>
      {children}
    </UIContext.Provider>
  );
};

export default UIProvider;
