import React from 'react';
import { Box, Heading, Text, Button, useToast, Spinner } from '@chakra-ui/core';
import useSWR, { useSWRPages } from 'swr';
import http from '@/http';
import EmptyView from '@/components/EmptyView';
import SequenceCard from '@/components/SequenceCard';
import { QuietLink } from '@/components/Link';

const SequenceList = () => {
  const toast = useToast();

  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    // page key
    'admin-jobs',
    /* eslint-disable react-hooks/rules-of-hooks */
    // page component
    ({ offset, withSWR }) => {
      const { data, error } = withSWR(
        // use the wrapper to wrap the *pagination API SWR*
        useSWR(`/hangboard-sequence?skip=${offset || 0}&take=25&`, http.get),
      );
      if (error)
        toast({
          description: error.message,
          status: 'error',
          isClosable: true,
        });
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
      return data.map((item) => {
        return <SequenceCard key={item.id} sequence={item} />;
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
    [],
  );

  return (
    <Box d="block" mb={[4, 8]} p={2}>
      <Box
        d="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={[2, 4]}
      >
        <Box width="100%">
          <Box
            d="flex"
            justifyContent="space-between"
            mb={1}
            alignItems="center"
            width="100%"
          >
            <Heading size="md">Sequences</Heading>
            <QuietLink
              to="/app/hangboard/sequence/new"
              width="auto"
              height="auto"
            >
              New
            </QuietLink>
          </Box>
          <Text size="xs" as="div" width="auto" height="auto" mb={2}>
            Choose a sequence to start the workout.
          </Text>
        </Box>
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
      {isReachingEnd && <EmptyView message="Nothing more to show." />}
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

export default SequenceList;
