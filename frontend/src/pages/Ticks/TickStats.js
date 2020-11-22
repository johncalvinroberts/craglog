import React, { useEffect } from 'react';
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
import { getErrorMessage } from '../../utils';
import http from '../../http';

const timeParameterOptions = [
  { label: 'All time', value: 'all' },
  { label: 'This month', value: 'month' },
  { label: 'This year', value: 'year' },
  { label: 'Choose custom time frame', value: 'custom' },
];

const TickStats = ({
  handleChangeTimeParameterType,
  handleChangeTimeParameter,
  timeParameterType,
  timeParameters,
  query,
}) => {
  const toast = useToast();

  const { data: stats, error: statsError } = useSWR(
    `/tick/stats?${query}`,
    http.get,
  );

  useEffect(() => {
    if (statsError) {
      toast({
        description: getErrorMessage(statsError),
        status: 'error',
        isClosable: true,
      });
    }
  }, [statsError, toast]);

  return (
    <>
      <Box d="block" mb={[4, 8]} borderWidth="1px" p={2}>
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

export default TickStats;
