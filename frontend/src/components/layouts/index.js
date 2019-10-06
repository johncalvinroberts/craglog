import React from 'react';
import { getUIState } from '../../states';
import { useGlobalState } from '../State';

export { default as Dashboard } from './Dashboard';

const Layout = ({ children }) => {
  const { Layout: StateLayout } = getUIState(useGlobalState());
  return <StateLayout>{children}</StateLayout>;
};

export default Layout;
