import React, { useState, useEffect } from 'react';
import useSWR, { useSWRPages, mutate } from 'swr';
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
import useThrottle from '../hooks/useThrottle';
import DashboardWrapper from '../components/DashboardWrapper';
import RouteCard from '../components/RouteCard';
import useTitle from '../hooks/useTitle';
import http from '../http';

const PAGE_KEY = 'admin-routes';

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
  const throttledQuery = useThrottle(query, 800);
  useEffect(() => {
    mutate(`_swr_page_count_${PAGE_KEY}`, 0);
    mutate(`_swr_page_offset_${PAGE_KEY}`, 0);
  }, [query]);

  const toast = useToast();
  const { data: stats, error: statsError } = useSWR('/route/stats', http.get);

  useEffect(() => {
    if (statsError) {
      toast({ description: statsError.message, status: 'error' });
    }
  }, [statsError, toast]);

  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    // page key
    PAGE_KEY,
    /* eslint-disable react-hooks/rules-of-hooks */
    // page component
    ({ offset, withSWR }) => {
      const { data } = withSWR(
        // use the wrapper to wrap the *pagination API SWR*
        useSWR(composeUrlString({ offset, query: throttledQuery }), http.get),
      );
      /* eslint-enable react-hooks/rules-of-hooks */
      // you can still use other SWRs outside

      if (!data) {
        return <p>loading</p>;
      }

      return data.map((item) => <RouteCard key={item.id} route={item} />);
    },

    // get next page's offset from the index of current page
    (SWR, index) => {
      // there's no next page
      if (SWR.data && SWR.data.length === 0) return null;

      // offset = pageCount × pageSize
      return (index + 1) * 25;
    },

    // deps of the page component
    [throttledQuery],
  );

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
        <Box>{pages}</Box>
        {isLoadingMore && (
          <Box
            d="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="50px"
          >
            <Spinner size="md" />
          </Box>
        )}
        {isReachingEnd && (
          <Box
            d="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="100px"
          >
            <Icon name="warning-2" mr={2} />
            <Heading size="s">Nothing.</Heading>
          </Box>
        )}
        {!isLoadingMore && (
          <Box
            d="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="100px"
          >
            <Button
              onClick={loadMore}
              disabled={isReachingEnd || isLoadingMore}
            >
              Load More
            </Button>
          </Box>
        )}
      </Box>
    </DashboardWrapper>
  );
}
