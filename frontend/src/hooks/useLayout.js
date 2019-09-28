import { useContext, useLayoutEffect } from 'react';
import { UIContext } from '../context/UI';

const useLayout = (Layout) => {
  const { dispatch } = useContext(UIContext);
  useLayoutEffect(() => dispatch({ Layout }), []);
};

export default useLayout;
