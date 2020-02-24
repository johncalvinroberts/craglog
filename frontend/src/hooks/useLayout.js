import { useLayoutEffect } from 'react';
import { useDispatch } from '@/components/State';

export default (Layout) => {
  const dispatch = useDispatch();
  useLayoutEffect(() => dispatch({ UI: { Layout } }), [Layout, dispatch]);
};
