import React from 'react';
import {
  Box,
  Spinner,
  Icon,
  Heading,
  Button,
  Text,
  useToast,
} from '@chakra-ui/core';
import useSWR, { useSWRPages } from 'swr';
import JobItem from './JobItem';
import http from '../../http';

const JobsDataGrid = ({ params }) => {
  const toast = useToast();

  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    // page key
    'admin-jobs',
    /* eslint-disable react-hooks/rules-of-hooks */
    // page component
    ({ offset, withSWR }) => {
      const { data, error, revalidate } = withSWR(
        // use the wrapper to wrap the *pagination API SWR*
        useSWR(
          `/job?skip=${offset || 0}&limit=25&type=${params.type}&status=${
            params.status
          }`,
          http.get,
        ),
      );
      if (error) toast({ description: error.message, status: 'error' });
      /* eslint-enable react-hooks/rules-of-hooks */
      // you can still use other SWRs outside
      if (!data) {
        return (
          <Box
            d="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
          >
            <Spinner size="xl" />
          </Box>
        );
      }
      return data.map((job) => {
        return (
          <JobItem
            item={job}
            key={job.id}
            type={params.type}
            revalidate={revalidate}
          />
        );
      });
    },

    // get next page's offset from the index of current page
    (SWR, index) => {
      // there's no next page
      if (SWR.data && SWR.data.length === 0) return null;

      // offset = pageCount × pageSize
      return (index + 1) * 3;
    },

    // deps of the page component
    [params.type, params.status],
  );

  return (
    <Box d="block" mb={8} borderWidth="1px" p={2}>
      <Box mb={4}>
        <Heading size="md">Jobs</Heading>
        <Text color="gray.500">Type: {params.type}</Text>
        <Text color="gray.500">Status: {params.status}</Text>
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
          <Button onClick={loadMore} disabled={isReachingEnd || isLoadingMore}>
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default JobsDataGrid;
