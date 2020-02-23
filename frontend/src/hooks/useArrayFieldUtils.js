import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { flatten, inflate } from 'flattenjs';
import { move as moveUtil, remove as removeUtil } from '@/utils';

export default (arrName) => {
  const { setValue, getValues, unregister, register } = useFormContext();
  const allValues = getValues();

  const setNextArray = useCallback(
    (nextArray) => {
      const flattened = flatten({ [arrName]: nextArray });
      /* eslint-disable no-restricted-syntax */
      for (const [key, value] of Object.entries(flattened)) {
        console.log({ [key]: value });
        setValue(key, value);
      }
      /* eslint-enable no-restricted-syntax */
    },
    [arrName, setValue],
  );

  const getPrevArray = useCallback(() => {
    const prevObj = Object.keys(allValues).reduce((memo, currentKey) => {
      return {
        ...memo,
        ...(currentKey.startsWith(arrName)
          ? { [currentKey]: allValues[currentKey] }
          : null),
      };
    }, {});

    const prevArray = [...inflate(prevObj)[arrName]];
    return prevArray;
  }, [allValues, arrName]);

  const move = useCallback(
    (from, to) => {
      const prevArray = getPrevArray();
      const nextArray = moveUtil(prevArray, to, from);
      setNextArray(nextArray);
    },
    [getPrevArray, setNextArray],
  );

  const remove = useCallback(
    (index) => {
      const prevArray = getPrevArray();
      const nextArray = removeUtil(prevArray, index);
      setNextArray(nextArray);
      const keyStart = `${arrName}[${index}]`;
      /* eslint-disable no-restricted-syntax */
      for (const name of Object.keys(allValues)) {
        if (name.startsWith(keyStart)) unregister(name);
        else register({ name });
      }
      /* eslint-enable no-restricted-syntax */
      console.log({ nextArray });
    },
    [allValues, arrName, getPrevArray, register, setNextArray, unregister],
  );
  return { move, remove };
};
