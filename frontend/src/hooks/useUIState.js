import { getUIState } from '@/states';
import { useGlobalState } from '@/components/State';

export default () => {
  return getUIState(useGlobalState());
};
