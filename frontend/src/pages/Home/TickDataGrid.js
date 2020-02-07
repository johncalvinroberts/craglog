import React, { createContext, useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { useToast, Box, Spinner, Button, Text } from '@chakra-ui/core';
import useSWR, { useSWRPages } from 'swr';
import format from 'date-fns/format';
import differenceInDays from 'date-fns/differenceInDays';
import isSameDay from 'date-fns/isSameDay';
import http from '../../http';
import getErrorMessage from '../../utils/getErrorMessage';
import camelCaseToTitleCase from '../../utils/camelCaseToTitleCase';
import EmptyView from '../../components/EmptyView';
import RouteCard from '../../components/RouteCard';

const DatesContext = createContext();

const reducer = (state, action) => ({ ...state, ...action });

const TickCard = ({ item, dictKey }) => {
  const datesDict = useContext(DatesContext);
  const allKeys = Object.keys(datesDict);
  const currentIndex = allKeys.indexOf(dictKey);
  if (currentIndex === -1) {
    return <></>;
  }

  const prevDate = datesDict[allKeys[currentIndex - 1]];
  const currentDate = item.tickDate;
  const daysFromPrevDate =
    prevDate && differenceInDays(new Date(prevDate), new Date(currentDate));
  const isSameDayAsPrevDate =
    prevDate && isSameDay(new Date(prevDate), new Date(currentDate));

  const isBigTimeGap = daysFromPrevDate > 100;
  const mt = isBigTimeGap ? `400px` : `${daysFromPrevDate * 4}px`;

  return (
    <Box d="flex" justifyContent="space-between" mt={mt}>
      <Box
        borderWidth="1px"
        borderRightWidth="0"
        borderRadius="0 0 4px 4px"
        flex="0 0 6rem"
        height="6rem"
        d="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        opacity={isSameDayAsPrevDate ? 0 : 1}
      >
        <Text fontSize="2xl" verticalAlign="baseline" fontWeight="semibold">
          {format(new Date(item.tickDate), 'MM/dd')}
        </Text>
        <Text
          fontSize="sm"
          opacity="0.8"
          mb={2}
          flex="0 0 100%"
          textAlign="center"
        >
          {format(new Date(item.tickDate), 'yyyy')}
        </Text>
      </Box>
      <Box
        flex="1"
        pl={2}
        borderWidth="1px"
        borderTopWidth={isSameDayAsPrevDate ? 0 : '1px'}
      >
        {camelCaseToTitleCase(item.style)}
      </Box>
    </Box>
  );
};

const TickDataGrid = ({ query }) => {
  const toast = useToast();
  const [datesDict, dispatch] = useReducer(reducer, {});

  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    // page key
    'ticks',
    /* eslint-disable react-hooks/rules-of-hooks */
    // page component
    ({ offset, withSWR }) => {
      const { data, error } = withSWR(
        // use the wrapper to wrap the *pagination API SWR*
        useSWR(`/tick?take=10&skip=${offset || 0}&${query}`, http.get, {
          refreshInterval: 100000,
        }),
      );
      /* eslint-enable react-hooks/rules-of-hooks */
      // you can still use other SWRs outside
      if (error) {
        toast({ status: 'error', description: getErrorMessage(error) });
      }

      if (!data) {
        return <></>;
      }

      const nextDatesDict = data.reduce((memo, current, index) => {
        const key = `${offset || 0}_${index}`;
        return { ...memo, [key]: current.tickDate };
      }, {});

      dispatch(nextDatesDict);
      // return nothing, not needed
      return data.map((item, index) => {
        return (
          <TickCard
            item={item}
            key={item.id}
            datesDict={datesDict}
            dictKey={`${offset || 0}_${index}`}
          />
        );
      });
    },

    // get next page's offset from the index of current page
    (SWR, index) => {
      // there's no next page
      if (SWR.data && SWR.data.length === 0) return null;

      // offset = pageCount × pageSize
      return (index + 1) * 10;
    },

    // deps of the page component
    [query, dispatch],
  );

  return (
    <DatesContext.Provider value={datesDict}>
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
    </DatesContext.Provider>
  );
};

export default TickDataGrid;
