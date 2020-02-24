import { useEffect } from 'react';
import { getInnerText } from '@/utils';
import { useDispatch } from '@/components/State';

// write the title to the document
// and to the global 'Interface' store
// title could be a component or a string
export default (Title) => {
  const dispatch = useDispatch('UI');

  useEffect(() => {
    const titleText = getInnerText(Title);
    document.title = `craglog | ${titleText}`;
    dispatch({ UI: { Title } });
  }, [dispatch]); //eslint-disable-line
};
