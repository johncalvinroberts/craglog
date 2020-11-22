import { useCallback, useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { getUuidV4, move as moveUtil, insert } from '../utils';

/* eslint-disable no-restricted-syntax */
export default (arrName) => {
  const {
    getValues,
    unregister,
    setValue,
    errors,
    setError,
    clearError,
    defaultValues = {},
  } = useFormContext();
  const [indexes, setIndexes] = useState([]);
  const [idsToCopy, setIdsToCopy] = useState({});
  const [valuesToSet, setValuesToSet] = useState([]);
  const [, setCount] = useState(0);

  useEffect(() => {
    const initialArray = defaultValues[arrName] || [];
    const initialIndexes = [];
    const appendValuesToSet = [];
    for (const item of initialArray) {
      const id = getUuidV4();
      initialIndexes.push({ id });
      const nameBase = `${arrName}[${id}]`;
      for (const [key, value] of Object.entries(item)) {
        appendValuesToSet.push({ key: `${nameBase}.${key}`, value });
      }
    }
    setValuesToSet(appendValuesToSet);
    setIndexes(initialIndexes);
  }, [arrName, defaultValues, setValue]);

  useEffect(() => {
    if (valuesToSet.length > 0) {
      for (const { key, value } of valuesToSet) {
        setValue(key, value);
      }
      setValuesToSet([]);
    }
  }, [setValue, valuesToSet]);

  useEffect(() => {
    const { newId, idToDuplicate } = idsToCopy;
    if (newId && idToDuplicate) {
      copyValues(idsToCopy);
    }
  }, [copyValues, idsToCopy]);

  useEffect(() => {
    const relevantErrors = errors[arrName];
    clearError(arrName);
    if (relevantErrors && relevantErrors.length > 0) {
      const errorsToSet = relevantErrors.map((error, index) => {
        const { id } = indexes[index];
        const errorField = Object.keys(error)[0];
        const { type, message } = error[errorField];
        const name = `${arrName}[${id}].${errorField}`;
        return { name, type, message };
      });
      setError(errorsToSet);
    }
  }, [arrName, clearError, errors, indexes, setError]);

  const copyValues = useCallback(
    ({ newId, idToDuplicate }) => {
      const allValues = getValues();
      const nameBase = `${arrName}[${idToDuplicate}]`;
      for (const [key, value] of Object.entries(allValues)) {
        if (key.startsWith(nameBase)) {
          const nextKey = key.replace(idToDuplicate, newId);
          setValue(nextKey, value);
        }
      }
    },
    [arrName, getValues, setValue],
  );

  const add = useCallback(
    (insertAt) => {
      insertAt = typeof insertAt === 'number' ? insertAt : indexes.length;
      const id = getUuidV4();
      const nextIndexes = insert(indexes, insertAt, {
        id,
      });

      setIndexes(nextIndexes);
      setCount((prevCount) => prevCount + 1);
      return id;
    },
    [indexes],
  );

  const move = useCallback(
    (from, to) => {
      const nextArray = moveUtil(indexes, to, from);
      setIndexes(nextArray);
    },
    [indexes],
  );

  const duplicate = useCallback(
    (index) => {
      const newId = add(index + 1);
      const { id: idToDuplicate } = indexes[index];
      setIdsToCopy({ newId, idToDuplicate });
    },
    [add, indexes],
  );

  const remove = useCallback(
    (id) => {
      const allValues = getValues();
      setIndexes((indexes) => indexes.filter((current) => current.id !== id));
      const nameBase = `${arrName}[${id}]`;
      for (const [key] of Object.entries(allValues)) {
        if (key.startsWith(nameBase)) unregister(key);
      }
    },
    [arrName, getValues, unregister],
  );
  return { move, remove, add, indexes, duplicate };
};

/* eslint-enable no-restricted-syntax */
