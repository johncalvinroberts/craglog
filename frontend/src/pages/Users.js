import React, { useEffect } from 'react';
import useSWR, { useSWRPages } from 'swr';
import {
  Box,
  Spinner,
  Icon,
  Heading,
  Button,
  Text,
  PseudoBox,
  StatGroup,
  Stat,
  StatNumber,
  StatHelpText,
  useToast,
} from '@chakra-ui/core';
import EmptyView from '@/components/EmptyView';
import DashboardWrapper from '@/components/DashboardWrapper';
import { useTitle } from '@/hooks';
import http from '@/http';

const UserItem = ({ user }) => {
  const { id, ...rest } = user;
  return (
    <Box borderBottom="1px" as={PseudoBox} borderColor="gray.200" py={2}>
      <Box d="flex" width="100%">
        <Box flex="1">
          <Box d="flex" alignItems="flex-start" width="100%">
            <Text fontWeight="bold" fontSize="xs">
              ID:
            </Text>
            <Text mx={2} fontSize="xs">
              {id}
            </Text>
          </Box>
          {Object.keys(rest).map((key) => {
            return (
              <Box d="flex" alignItems="flex-start" width="100%" key={key}>
                <Text fontWeight="bold" fontSize="xs">
                  {key}:{' '}
                </Text>
                <Text mx={2} fontSize="xs">
                  {rest[key]}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

const Users = () => {
  useTitle(
    <>
      Admin <Icon name="chevron-right" /> Users
    </>,
  );

  const toast = useToast();

  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    // page key
    'admin-users',
    /* eslint-disable react-hooks/rules-of-hooks */
    // page component
    ({ offset, withSWR }) => {
      const { data: users } = withSWR(
        // use the wrapper to wrap the *pagination API SWR*
        useSWR(`/user?skip=${offset || 0}&take=25`, http.get),
      );
      /* eslint-enable react-hooks/rules-of-hooks */
      // you can still use other SWRs outside

      if (!users) {
        return <p>loading</p>;
      }

      return users.map((user) => <UserItem key={user.id} user={user} />);
    },

    // get next page's offset from the index of current page
    (SWR, index) => {
      // there's no next page
      if (SWR.data && SWR.data.length === 0) return null;

      // offset = pageCount × pageSize
      return (index + 1) * 25;
    },

    // deps of the page component
    [],
  );

  const { data: stats, error: statsError } = useSWR('/user/stats', http.get);

  useEffect(() => {
    if (statsError) {
      toast({ message: statsError, status: 'error' });
    }
  }, [statsError, toast]);

  return (
    <DashboardWrapper>
      <Box d="block" mb={8} borderWidth="1px" p={2}>
        <Box mb={4}>
          <Heading size="md">Users</Heading>
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
              {!stats ? <Spinner size="xl" /> : stats.week}
            </StatNumber>
            <StatHelpText textTransform="uppercase">This Week</StatHelpText>
          </Stat>
          <Stat>
            <StatNumber as="div">
              {!stats ? <Spinner size="xl" /> : stats.month}
            </StatNumber>
            <StatHelpText textTransform="uppercase">This month</StatHelpText>
          </Stat>
        </StatGroup>
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
        {isReachingEnd && <EmptyView />}
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
};

export default Users;
