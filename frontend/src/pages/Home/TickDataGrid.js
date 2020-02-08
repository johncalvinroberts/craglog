import React, { createContext, useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';
import {
  useToast,
  Box,
  Spinner,
  Button,
  Text,
  useColorMode,
} from '@chakra-ui/core';
import useSWR, { useSWRPages } from 'swr';
import format from 'date-fns/format';
import differenceInDays from 'date-fns/differenceInDays';
import isSameDay from 'date-fns/isSameDay';
import isSameYear from 'date-fns/isSameYear';
import http from '../../http';
import getErrorMessage from '../../utils/getErrorMessage';
import camelCaseToTitleCase from '../../utils/camelCaseToTitleCase';
import EmptyView from '../../components/EmptyView';
import RouteCard from '../../components/RouteCard';
import TickStyleChip from '../../components/TickStyleChip';
import TickTypeChip from '../../components/TickTypeChip';

const DatesContext = createContext();

const reducer = (state, action) => ({ ...state, ...action });

const TickCard = ({ item, dictKey }) => {
  const { colorMode } = useColorMode();
  const bg = { light: 'white', dark: 'gray.800' };

  const datesDict = useContext(DatesContext);
  const allKeys = Object.keys(datesDict);
  const currentIndex = allKeys.indexOf(dictKey);
  if (currentIndex === -1) {
    return <></>;
  }

  const prevDateString = datesDict[allKeys[currentIndex - 1]];
  const prevDate = prevDateString && new Date(prevDateString);
  const currentDate = new Date(item.tickDate);
  const daysFromPrevDate = prevDate && differenceInDays(prevDate, currentDate);
  const isSameDayAsPrevDate = prevDate && isSameDay(prevDate, currentDate);
  const isBigTimeGap = daysFromPrevDate > 100;

  let mt = `${daysFromPrevDate + 4}px`;
  if (isBigTimeGap) mt = `200px`;
  if (isSameDayAsPrevDate) mt = 0;

  const isFirstOfYear = !prevDate ? true : !isSameYear(prevDate, currentDate);

  return (
    <>
      {isFirstOfYear && (
        <>
          <Box
            width="1px"
            borderRightWidth="1px"
            height={mt}
            mb={`-${mt}`}
            ml="3rem"
          />
          <Box flex="0 0 100%" position="sticky" top="4rem">
            <Text
              fontSize="2xl"
              verticalAlign="baseline"
              fontWeight="semibold"
              width="6rem"
              bg={bg[colorMode]}
              textAlign="center"
              borderWidth="1px"
              pb={1}
              mt={mt}
            >
              {format(currentDate, 'yyyy')}
            </Text>
          </Box>
          <Box
            width="1px"
            borderRightWidth="1px"
            height={2}
            mt={-1}
            ml="3rem"
          />
        </>
      )}
      <Box>
        {!isFirstOfYear && !isSameDayAsPrevDate && (
          <Box
            width="1px"
            borderRightWidth="1px"
            height={mt}
            mb={`-${mt}`}
            ml="3rem"
          />
        )}
        <Box
          d="flex"
          justifyContent="space-between"
          mt={isFirstOfYear ? 0 : mt}
          flexWrap="wrap"
        >
          <Box
            flex="0 0 6rem"
            height="6rem"
            d="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            {...(!isSameDayAsPrevDate
              ? { borderWidth: '1px', borderRightWidth: '0' }
              : null)}
          >
            {!isSameDayAsPrevDate && (
              <Text
                fontSize="2xl"
                verticalAlign="baseline"
                fontWeight="semibold"
              >
                {format(currentDate, 'MM/dd')}
              </Text>
            )}
            {isSameDayAsPrevDate && (
              <Box width="1px" borderRightWidth="1px" height="100%" />
            )}
          </Box>
          <Box
            flex="1"
            p={2}
            borderWidth="1px"
            borderTopWidth={isSameDayAsPrevDate ? 0 : '1px'}
          >
            <Box display="flex" justifyContent="flex-start">
              <TickStyleChip style={item.style} />
              <TickTypeChip type={item.type} />
            </Box>
            {item.route && (
              <RouteCard
                route={item.route}
                showLink={false}
                showStyle={false}
                borderBottom="none"
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
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
      <Box position="relative">{pages}</Box>
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
