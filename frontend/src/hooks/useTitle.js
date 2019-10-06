import { useEffect } from 'react';
import getInnerText from '../utils/getInnerText';
import { useDispatch } from '../components/State';

// write the title to the document
// and to the global 'Interface' store
// title could be a component or a string
const useTitle = (title) => {
  const dispatch = useDispatch('UI');

  useEffect(() => {
    const titleText = getInnerText(title);
    document.title = `craglog | ${titleText}`;
    dispatch({ title });
  }, [title, dispatch]);
};

export default useTitle;
