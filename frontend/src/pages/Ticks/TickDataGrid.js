import React, { useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast, Box, Spinner, Button } from '@chakra-ui/core';
import { useSWRInfinite } from 'swr';
import http from '../../http';
import getErrorMessage from '../../utils/getErrorMessage';
import EmptyView from '../../components/EmptyView';
import { TickCard } from './TickCard';
import { TickDatesContext } from './TickDatesContext';

const reducer = (state, action) => ({ ...state, ...action });

const getDictKey = (page, index) => `${page || 0}_${index}`;

const TickPage = ({ page, pageIndex, size, dispatch }) => {
  useEffect(() => {
    if (page && page.length > 0) {
      const nextDatesDict = page.reduce((memo, current, index) => {
        const key = getDictKey(pageIndex, index);
        return { ...memo, [key]: current.tickDate };
      }, {});
      dispatch(nextDatesDict);
    }
  }, [pageIndex, page, size, dispatch]);

  return page.map((item, index) => (
    <TickCard
      item={item}
      key={item.id}
      dictKey={getDictKey(pageIndex, index)}
    />
  ));
};

const TickDataGrid = ({ query }) => {
  const toast = useToast();
  const [datesDict, dispatch] = useReducer(reducer, {});

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end
    const skip = (pageIndex + 1) * 10 - 10;
    const params = new URLSearchParams({
      take: 10,
      skip,
      ...query,
    });
    return `/tick?${params.toString()}`;
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    http.get,
  );

  if (error) {
    toast({
      status: 'error',
      description: getErrorMessage(error),
      isClosable: true,
    });
  }

  if (!data) {
    return (
      <Box
        d="flex"
        alignItems="center"
        p={4}
        justifyContent="center"
        width="100%"
      >
        <Spinner />
      </Box>
    );
  }

  const pages = data.map((item, index) => {
    return (
      <TickPage
        page={item}
        pageIndex={index}
        key={item}
        size={size}
        dispatch={dispatch}
      />
    );
  });

  return (
    <TickDatesContext.Provider value={datesDict}>
      <Box position="relative">{pages}</Box>
      {isValidating && (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="50px"
        >
          loading....
        </Box>
      )}
      {!data && (
        <EmptyView message="No more logs to show">
          <Button
            as={Link}
            to="/app/tick/new"
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
      {!isValidating && size && (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100px"
        >
          <Button onClick={() => setSize(size + 1)} disabled={isValidating}>
            Load More
          </Button>
        </Box>
      )}
    </TickDatesContext.Provider>
  );
};

export default TickDataGrid;
