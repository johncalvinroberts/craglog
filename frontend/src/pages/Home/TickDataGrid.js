import React from 'react';
import { Link } from 'react-router-dom';
import { useToast, Box, Spinner, Button } from '@chakra-ui/core';
import useSWR, { useSWRPages } from 'swr';
import http from '../../http';
import getErrorMessage from '../../utils/getErrorMessage';
import EmptyView from '../../components/EmptyView';

const TickDataGrid = ({ query }) => {
  const toast = useToast();

  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    // page key
    'ticks',
    /* eslint-disable react-hooks/rules-of-hooks */
    // page component
    ({ offset, withSWR }) => {
      const { data, error } = withSWR(
        // use the wrapper to wrap the *pagination API SWR*
        useSWR(`/tick?take=10&skip=${offset || 0}&${query}`, http.get),
      );
      /* eslint-enable react-hooks/rules-of-hooks */
      // you can still use other SWRs outside
      if (error) {
        toast({ status: 'error', description: getErrorMessage(error) });
      }
      if (!data) {
        return <p />;
      }

      return data.map((item) => <div key={item.id}>{item.id}</div>);
    },

    // get next page's offset from the index of current page
    (SWR, index) => {
      // there's no next page
      if (SWR.data && SWR.data.length === 0) return null;

      // offset = pageCount × pageSize
      return (index + 1) * 10;
    },

    // deps of the page component
    [query],
  );
  return (
    <>
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
        <EmptyView message="No more logs to show">
          <Button
            as={Link}
            to="/app/ticks/new"
            backgroundColor="teal.300"
            variant="solid"
            color="white"
            _hover={{
              backgroundColor: 'teal.200',
            }}
          >
            Log a new climb now
          </Button>
        </EmptyView>
      )}
      {!isLoadingMore && !isReachingEnd && (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100px"
        >
          <Button onClick={loadMore} disabled={isReachingEnd || isLoadingMore}>
            Load More
          </Button>
        </Box>
      )}
    </>
  );
};

export default TickDataGrid;
