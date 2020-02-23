import React from 'react';
import { Box, Heading, Text, Button, useToast, Spinner } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import useSWR, { useSWRPages } from 'swr';
import http from '@/http';
import EmptyView from '@/components/EmptyView';
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
        return <Box key={item.id}>{item.name}</Box>;
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
        <Box>
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
          <Text size="xs" as="div" width="auto" height="auto">
            Your hangboard sequences. Choose a sequence to start the workout.
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
      {isReachingEnd && (
        <EmptyView message="You have not added any hangboard sequences yet.">
          <Button
            as={Link}
            to="/app/hangboard/sequence/new"
            backgroundColor="teal.300"
            variant="solid"
            color="white"
            _hover={{
              backgroundColor: 'teal.200',
            }}
            my={8}
          >
            Add a new hangboard sequence
          </Button>
        </EmptyView>
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

export default SequenceList;
