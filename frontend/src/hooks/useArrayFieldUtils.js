import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getUuidV4, move as moveUtil } from '@/utils';

/* eslint-disable no-restricted-syntax */
export default (arrName) => {
  const [indexes, setIndexes] = useState([]);
  const [, setCount] = useState(0);
  const { getValues, unregister } = useFormContext();
  const allValues = getValues();

  const add = useCallback(() => {
    setIndexes((prevIndexes) => [...prevIndexes, { id: getUuidV4() }]);
    setCount((prevCount) => prevCount + 1);
  }, []);

  const move = useCallback(
    (from, to) => {
      const nextArray = moveUtil(indexes, to, from);
      setIndexes(nextArray);
    },
    [indexes],
  );

  const remove = useCallback(
    (id) => {
      setIndexes((indexes) => indexes.filter((current) => current.id !== id));
      const nameBase = `${arrName}[${id}]`;
      for (const [key] of Object.entries(allValues)) {
        if (key.startsWith(nameBase)) unregister(key);
      }
    },
    [allValues, arrName, unregister],
  );
  return { move, remove, add, indexes };
};

/* eslint-enable no-restricted-syntax */
