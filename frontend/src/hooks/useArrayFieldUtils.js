import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getUuidV4, move as moveUtil } from '@/utils';

/* eslint-disable no-restricted-syntax */
export default (arrName) => {
  const [indexes, setIndexes] = useState([]);
  const [count, setCount] = useState(0);
  const { getValues, unregister } = useFormContext();
  const allValues = getValues();

  const add = useCallback(() => {
    setIndexes((prevIndexes) => [
      ...prevIndexes,
      { index: count, id: getUuidV4() },
    ]);
    setCount((prevCount) => prevCount + 1);
  }, [count]);

  const move = useCallback(
    (from, to) => {
      const nextArray = moveUtil(indexes, to, from);
      setIndexes(nextArray);
    },
    [indexes],
  );

  const remove = useCallback(
    (index) => {
      setIndexes((indexes) =>
        indexes.filter((current) => current.index !== index),
      );
      const nameBase = `${arrName}[${index}]`;
      for (const [key] of Object.entries(allValues)) {
        if (key.startsWith(nameBase)) unregister(key);
      }
    },
    [allValues, arrName, unregister],
  );
  return { move, remove, add, indexes };
};

/* eslint-enable no-restricted-syntax */
