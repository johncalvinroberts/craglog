import React from 'react';
import useSWR, { useSWRPages } from 'swr';
import {
  Box,
  Spinner,
  Icon,
  Heading,
  Button,
  Text,
  PseudoBox,
} from '@chakra-ui/core';
import DashboardWrapper from '../components/DashboardWrapper';
import useTitle from '../hooks/useTitle';
import http from '../http';

const UserItem = ({ user }) => {
  const { _id, ...rest } = user;
  return (
    <Box borderBottom="1px" as={PseudoBox} borderColor="gray.200" py={2}>
      <Box d="flex" width="100%">
        <Box flex="1">
          <Box d="flex" alignItems="flex-start" width="100%">
            <Text fontWeight="bold" fontSize="xs">
              ID:
            </Text>
            <Text mx={2} fontSize="xs">
              {_id}
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
      admin <Icon name="chevron-right" /> Users
    </>,
  );
  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    // page key
    'demo-page-2',
    /* eslint-disable react-hooks/rules-of-hooks */
    // page component
    ({ offset, withSWR }) => {
      const { data: users } = withSWR(
        // use the wrapper to wrap the *pagination API SWR*
        useSWR(`/users?skip=${offset || 0}&limit=25`, http.get),
      );
      /* eslint-enable react-hooks/rules-of-hooks */
      // you can still use other SWRs outside

      if (!users) {
        return <p>loading</p>;
      }

      return users.map((user) => <UserItem key={user._id} user={user} />);
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
          <Heading size="md">users</Heading>
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
};

export default Users;
