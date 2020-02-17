import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { flatten, inflate } from 'flattenjs';
import { move as moveUtil } from '@/utils';

export default (arrName) => {
  const { setValue, getValues } = useFormContext();
  const allValues = getValues();
  const move = useCallback(
    (from, to) => {
      const prevObj = Object.keys(allValues).reduce((memo, currentKey) => {
        return {
          ...memo,
          ...(currentKey.startsWith(arrName)
            ? { [currentKey]: allValues[currentKey] }
            : null),
        };
      }, {});

      const prevArray = [...inflate(prevObj)[arrName]];
      const nextArray = moveUtil(prevArray, to, from);
      const flattened = flatten({ [arrName]: nextArray });

      /* eslint-disable no-restricted-syntax */
      for (const [key, value] of Object.entries(flattened)) {
        setValue(key, value);
      }
    },
    [allValues, arrName, setValue],
  );
  /* eslint-enable no-restricted-syntax */
  return { move };
};
