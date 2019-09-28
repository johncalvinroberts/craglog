import React, { useContext } from 'react';
import { UIContext } from '../context/UI';

const Layout = ({ children }) => {
  const { state } = useContext(UIContext);
  const { Layout: StateLayout } = state;
  return <StateLayout>{children}</StateLayout>;
};

export default Layout;
