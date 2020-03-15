import useDeepCompareEffect from 'use-deep-compare-effect';
import { getInnerText } from '@/utils';
import { useDispatch } from '@/components/State';

// write the title to the document
// and to the global 'Interface' store
// title could be a component or a string
export default (Title) => {
  const dispatch = useDispatch('UI');
  const titleText = getInnerText(Title);

  useDeepCompareEffect(() => {
    document.title = `craglog | ${titleText}`;
    dispatch({ UI: { Title } });
  }, [dispatch, titleText]); //eslint-disable-line
};
