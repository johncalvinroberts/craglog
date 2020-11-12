import React, { useEffect, useState } from 'react';
import { Box, Spinner, Heading, Button, Text, useToast } from '@chakra-ui/core';
import useSWR from 'swr';
import http from '@/http';
import JobItem from './JobItem';

const JobsDataGrid = ({ params }) => {
  const toast = useToast();
  const [pageIndex, setPageIndex] = useState(0);
  const offset = pageIndex * 25;
  const { data, error, revalidate } = useSWR(
    `/jobs?skip=${offset || 0}&limit=25&type=${params.type}&status=${
      params.status
    }`,
    http.get,
  );

  useEffect(() => {
    if (error)
      toast({
        description: error.message,
        status: 'error',
        isClosable: true,
      });
  }, [error, toast]);

  useEffect(() => {
    setPageIndex(0);
    revalidate();
  }, [params.status, params.type, revalidate, setPageIndex]);

  return (
    <Box d="block" mb={8} borderWidth="1px" p={2}>
      <Box mb={4}>
        <Heading size="md">Jobs</Heading>
        <Text color="gray.500">Type: {params.type}</Text>
        <Text color="gray.500">Status: {params.status}</Text>
      </Box>
      {!data && (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="200px"
        >
          <Spinner size="xl" />
        </Box>
      )}
      {data &&
        data.map((job) => {
          return (
            <JobItem
              item={job}
              key={job.id}
              type={params.type}
              revalidate={revalidate}
            />
          );
        })}
      <Button
        onClick={() => setPageIndex(pageIndex - 1)}
        disabled={pageIndex === 0}
      >
        Previous
      </Button>
      <Button onClick={() => setPageIndex(pageIndex + 1)}>Next</Button>
    </Box>
  );
};

export default JobsDataGrid;
