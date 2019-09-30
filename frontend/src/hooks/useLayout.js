import { useLayoutEffect } from 'react';
import { useDispatch } from '../components/State';

const useLayout = (Layout) => {
  const dispatch = useDispatch();
  useLayoutEffect(() => dispatch({ 'UI': { Layout } }), [Layout, dispatch]);
};

export default useLayout;
