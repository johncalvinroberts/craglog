import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
  Box,
  Spinner,
  Icon,
  Heading,
  Button,
  Input,
  StatGroup,
  Stat,
  StatNumber,
  StatHelpText,
  useToast,
} from '@chakra-ui/core';
import DashboardWrapper from '@/components/DashboardWrapper';
import RouteCard from '@/components/RouteCard';
import { useTitle, useThrottle } from '@/hooks';
import http from '@/http';

const composeUrlString = ({ query, offset }) => {
  const params = new URLSearchParams({
    skip: offset || 0,
    take: 25,
    ...(query ? { name: query } : null),
    orderBy: 'createdAt',
    sort: 'DESC',
  });
  return `/route?${params.toString()}`;
};

export default function Routes() {
  useTitle(
    <>
      Admin <Icon name="chevron-right" /> Routes
    </>,
  );

  const [query, setQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const throttledQuery = useThrottle(query, 800);

  const offset = pageIndex * 25;

  const toast = useToast();
  const { data: stats, error: statsError } = useSWR('/route/stats', http.get);
  const { data, error } = useSWR(
    composeUrlString({ offset, query: throttledQuery }),
    http.get,
  );

  useEffect(() => {
    if (statsError) {
      toast({ description: statsError.message, status: 'error' });
    }
  }, [statsError, toast]);

  useEffect(() => {
    if (error) {
      toast({ description: error.message, status: 'error' });
    }
  }, [error, toast]);

  return (
    <DashboardWrapper>
      <Box d="block" mb={8} borderWidth="1px" p={2}>
        <Box mb={4}>
          <Heading size="md">Routes</Heading>
        </Box>
        <StatGroup mb={4}>
          <Stat>
            <StatNumber as="div">
              {!stats ? <Spinner size="xl" /> : stats.total}
            </StatNumber>
            <StatHelpText textTransform="uppercase">Total</StatHelpText>
          </Stat>
          <Stat>
            <StatNumber as="div">
              {!stats ? <Spinner size="xl" /> : stats.boulder}
            </StatNumber>
            <StatHelpText textTransform="uppercase">Boulders</StatHelpText>
          </Stat>
          <Stat>
            <StatNumber as="div">
              {!stats ? <Spinner size="xl" /> : stats.sport}
            </StatNumber>
            <StatHelpText textTransform="uppercase">Sport</StatHelpText>
          </Stat>
          <Stat>
            <StatNumber as="div">
              {!stats ? <Spinner size="xl" /> : stats.trad}
            </StatNumber>
            <StatHelpText textTransform="uppercase">Trad</StatHelpText>
          </Stat>
        </StatGroup>
        <Box my={2}>
          <Input
            placeholder="Search for routes"
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
        </Box>
        <Box>
          {data && data.map((item) => <RouteCard route={item} key={item.id} />)}
        </Box>
        {!data && (
          <Box
            d="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="50px"
          >
            <Spinner size="md" />
          </Box>
        )}
        <Button
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          Previous
        </Button>
        <Button onClick={() => setPageIndex(pageIndex + 1)}>Next</Button>
      </Box>
    </DashboardWrapper>
  );
}
