import { getAuthState } from '../states';
import { useGlobalState } from '../components/State';

export default () => {
  return getAuthState(useGlobalState());
};
