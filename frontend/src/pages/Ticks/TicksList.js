import React, { useCallback, useState, useMemo } from 'react';
import isValid from 'date-fns/isValid';
import format from 'date-fns/format';
import { useTitle } from '@/hooks';
import { DATE_INPUT_FORMAT } from '@/constants';
import TickStats from './TickStats';
import TickDataGrid from './TickDataGrid';

const now = new Date();
const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
const defaultEndDate = format(now, DATE_INPUT_FORMAT);
const defaultStartDate = format(
  new Date(now.setMonth(now.getMonth() - 3)),
  DATE_INPUT_FORMAT,
);

const getUrlParams = ({ timeParameters, timeParameterType }) => {
  let startDate;
  let endDate;
  if (timeParameterType === 'month') {
    startDate = oneMonthAgo;
  }

  if (timeParameterType === 'year') {
    startDate = oneYearAgo;
  }

  if (timeParameterType === 'custom') {
    startDate = isValid(new Date(timeParameters.startDate))
      ? new Date(timeParameters.startDate)
      : null;
    endDate = isValid(new Date(timeParameters.endDate))
      ? new Date(timeParameters.endDate)
      : null;
  }

  if (!startDate && !endDate) return '';

  const query = new URLSearchParams({
    ...(startDate ? { startDate: startDate.toISOString() } : null),
    ...(endDate ? { endDate: endDate.toISOString() } : null),
  });

  return query.toString();
};

const TicksList = () => {
  useTitle('Craglog');

  const [timeParameterType, setTimeParameterType] = useState('all');
  const [timeParameters, setTimeParameters] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  const query = useMemo(
    () => getUrlParams({ timeParameters, timeParameterType }),
    [timeParameters, timeParameterType],
  );

  const handleChangeTimeParameterType = useCallback((event) => {
    setTimeParameterType(event.target.value);
  }, []);

  const handleChangeTimeParameter = useCallback(
    (event, key) => {
      setTimeParameters({ ...timeParameters, [key]: event.target.value });
    },
    [timeParameters],
  );

  return (
    <>
      <TickStats
        handleChangeTimeParameter={handleChangeTimeParameter}
        timeParameters={timeParameters}
        handleChangeTimeParameterType={handleChangeTimeParameterType}
        timeParameterType={timeParameterType}
        query={query}
      />
      <TickDataGrid query={query} />
    </>
  );
};

export default TicksList;
