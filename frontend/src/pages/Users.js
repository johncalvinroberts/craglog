import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
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
  const [pageIndex, setPageIndex] = useState(0);
  const offset = pageIndex * 25;
  const { data, error } = useSWR(`/user?skip=${offset || 0}&take=25`, http.get);

  const { data: stats, error: statsError } = useSWR('/user/stats', http.get);

  useEffect(() => {
    if (error)
      toast({
        description: error.message,
        status: 'error',
        isClosable: true,
      });
  }, [error, toast]);

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
        <Box>
          {data && data.map((user) => <UserItem key={user.id} user={user} />)}
        </Box>
        <Button
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          Previous
        </Button>
        <Button onClick={() => setPageIndex(pageIndex + 1)}>Next</Button>
      </Box>
    </DashboardWrapper>
  );
};

export default Users;
