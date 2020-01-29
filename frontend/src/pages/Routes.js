import React from 'react';
import useSWR, { useSWRPages } from 'swr';
import { Box, Spinner, Icon, Heading, Button } from '@chakra-ui/core';
import DashboardWrapper from '../components/DashboardWrapper';
import RouteCard from '../components/RouteCard';
import useTitle from '../hooks/useTitle';
import http from '../http';

export default function Routes() {
  useTitle(
    <>
      admin <Icon name="chevron-right" /> Routes
    </>,
  );
  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    // page key
    'admin-routes',
    /* eslint-disable react-hooks/rules-of-hooks */
    // page component
    ({ offset, withSWR }) => {
      const { data } = withSWR(
        // use the wrapper to wrap the *pagination API SWR*
        useSWR(`/route?skip=${offset || 0}&take=25`, http.get),
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
      return (index + 1) * 3;
    },

    // deps of the page component
    [],
  );
  return (
    <DashboardWrapper>
      <Box d="block" mb={8} borderWidth="1px" p={2}>
        <Box mb={4}>
          <Heading size="md">Routes</Heading>
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
