import React, { useEffect, useState } from 'react';
import {
  Box,
  StatGroup,
  Stat,
  StatNumber,
  Spinner,
  StatHelpText,
  useToast,
  Select,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/core';
import useSWR from 'swr';
import setMonth from 'date-fns/setMonth';
import setYear from 'date-fns/setYear';
import useTitle from '../../hooks/useTitle';
import http from '../../http';
import getErrorMessage from '../../utils/getErrorMessage';

const timeParameterOptions = [
  { label: 'All time', value: 'all' },
  { label: 'This month', value: 'month' },
  { label: 'This year', value: 'year' },
  { label: 'Choose custom time frame', value: 'custom' },
];

const getStatsUrl = ({ timeParameters, timeParameterType }) => {
  const url = '/tick/stats';
  const now = new Date();
  switch (timeParameterType) {
    case 'all':
      return url;
    case 'month':
      return `${url}?startDate=${setMonth(now, now.getMonth() - 1)}`;
    case 'year':
      return `${url}?startDate=${setYear(now, now.getYear() - 1)}`;
    case 'custom':
      return `${url}?startDate=${timeParameters.startDate.toISOString()}&endDate=${timeParameters.endDate.toISOString()}`;
    default:
      return url;
  }
};

const TickList = () => {
  useTitle('Craglog');
  const toast = useToast();

  const [timeParameterType, setTimeParameterType] = useState('all');
  const [timeParameters, setTimeParameters] = useState({});

  const { data: stats, error: statsError } = useSWR(
    getStatsUrl({ timeParameters, timeParameterType }),
    http.get,
  );

  useEffect(() => {
    if (statsError) {
      toast({ description: getErrorMessage(statsError), status: 'error' });
    }
  }, [statsError, toast]);

  const handleChangeTimeParameterType = (event) => {
    setTimeParameterType(event.target.value);
  };

  const handleChangeTimeParameter = (event, key) => {
    setTimeParameters({ ...timeParameters, [key]: event.target.value });
  };

  return (
    <>
      <Box d="block" mb={8} borderWidth="1px" p={2} position="sticky">
        {!stats && (
          <Box
            d="flex"
            width="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Spinner size="xl" />
          </Box>
        )}
        <StatGroup mb={4} justifyContent={['flex-start', 'space-around']}>
          {stats &&
            Object.keys(stats).map((key) => (
              <Stat flex={['0 0 25%', '1']} key={key}>
                <StatNumber as="div">{stats[key]}</StatNumber>
                <StatHelpText textTransform="capitalize">{key}</StatHelpText>
              </Stat>
            ))}
        </StatGroup>
        <Box mb={timeParameterType === 'custom' ? 4 : 0}>
          <Select
            aria-describedby="time-select-helper"
            value={timeParameterType}
            onChange={handleChangeTimeParameterType}
            maxWidth="310px"
          >
            {timeParameterOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Box>
        {timeParameterType === 'custom' && (
          <Box d="flex" flexWrap="wrap" justifyContent="space-between">
            <FormControl mb={4} width="100%" maxWidth="310px">
              <FormLabel htmlFor="start-date">Start Time</FormLabel>
              <Input
                value={timeParameters.startDate}
                type="datetime-local"
                name="start-date"
                onChange={(event) =>
                  handleChangeTimeParameter(event, 'startDate')
                }
              />
            </FormControl>
            <FormControl mb={4} width="100%" maxWidth="310px">
              <FormLabel htmlFor="end-date">End Time</FormLabel>
              <Input
                value={timeParameters.endDate}
                type="datetime-local"
                name="end-date"
                onChange={(event) =>
                  handleChangeTimeParameter(event, 'endDate')
                }
              />
            </FormControl>
          </Box>
        )}
      </Box>
    </>
  );
};

export default TickList;
