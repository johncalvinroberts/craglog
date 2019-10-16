import React, { useState, useEffect } from 'react';
import {
  useToast,
  StatGroup,
  Box,
  Stat,
  StatNumber,
  StatHelpText,
  Spinner,
  Icon,
  Heading,
  ButtonGroup,
  Button,
  PseudoBox,
  Text,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
} from '@chakra-ui/core';
import format from 'date-fns/format';
import useLayout from '@/hooks/useLayout';
import useTitle from '@/hooks/useTitle';
import useInterval from '@/hooks/useInterval';
import Dashboard from '@/layouts/Dashboard';
import DashboardWrapper from '@/components/DashboardWrapper';
import { getJobsState, getCountData } from '@/states';
import { useDispatch, useGlobalState } from '@/components/State';
import { updateQueue, fetchJobs, updateJob } from '@/api';
import { DATE_FORMAT } from '../constants';

const PseudoButton = ({ children, ...props }) => {
  return (
    <PseudoBox
      as="button"
      _focus={{ outline: 'none' }}
      _hover={{
        borderColor: 'teal.300',
      }}
      borderWidth="1px"
      p={2}
      transition="all 0.3s"
      {...props}
    >
      {children}
    </PseudoBox>
  );
};

const JobsCountData = ({ params, handleChangeParams }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [buttonLoadingStates, setButtonLoadingStates] = useState({
    route: { pause: false, resume: false },
    list: { pause: false, resume: false },
  });

  useInterval(async () => {
    try {
      await dispatch(getCountData());
    } catch (error) {
      toast({
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }, 5000);

  const handleQueueCommand = async ({ type, command }) => {
    try {
      setButtonLoadingStates({
        ...buttonLoadingStates,
        [type]: { ...buttonLoadingStates[type], [command]: true },
      });
      await updateQueue({ type, command });

      setButtonLoadingStates({
        ...buttonLoadingStates,
        [type]: { ...buttonLoadingStates[type], [command]: false },
      });
      toast({
        description: `${type} queue ${command} success`,
      });
    } catch (error) {
      toast({
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const { countData } = getJobsState(useGlobalState());
  const { route = {}, list = {} } = countData.data || {};
  return (
    <Box d="block" mb={8} borderWidth="1px" p={2}>
      {countData.isLoading && !countData.data && <Spinner size="xl" />}
      {countData.data && (
        <>
          <Box d="flex" justifyContent="space-between">
            <Heading size="md" mb={4}>
              Route Scraping Queue
            </Heading>
            <ButtonGroup spacing={4}>
              <Button
                size="xs"
                border="2px"
                borderColor="teal.300"
                variant="solid"
                isLoading={buttonLoadingStates.route.pause}
                onClick={() =>
                  handleQueueCommand({ type: 'route', command: 'pause' })
                }
              >
                Pause
              </Button>
              <Button
                size="xs"
                border="2px"
                borderColor="teal.300"
                variant="solid"
                isLoading={buttonLoadingStates.route.resume}
                onClick={() =>
                  handleQueueCommand({ type: 'route', command: 'resume' })
                }
              >
                Resume
              </Button>
            </ButtonGroup>
          </Box>
          <StatGroup mb={8}>
            {Object.keys(route).map((key) => {
              const isActive = params.type === 'route' && params.status === key;
              return (
                <Stat
                  key={key}
                  as={PseudoButton}
                  backgroundColor={isActive ? 'gray.500' : null}
                  onClick={() =>
                    handleChangeParams({ type: 'route', status: key })
                  }
                >
                  <StatNumber>{route[key]}</StatNumber>
                  <StatHelpText textTransform="uppercase">{key}</StatHelpText>
                </Stat>
              );
            })}
          </StatGroup>
          <Box d="flex" justifyContent="space-between">
            <Heading size="md" mb={4}>
              List Scraping Queue
            </Heading>
            <ButtonGroup spacing={4}>
              <Button
                size="xs"
                border="2px"
                borderColor="teal.300"
                variant="solid"
                isLoading={buttonLoadingStates.list.pause}
                onClick={() =>
                  handleQueueCommand({ type: 'list', command: 'pause' })
                }
              >
                Pause
              </Button>
              <Button
                size="xs"
                border="2px"
                borderColor="teal.300"
                variant="solid"
                isLoading={buttonLoadingStates.list.resume}
                onClick={() =>
                  handleQueueCommand({ type: 'list', command: 'resume' })
                }
              >
                Resume
              </Button>
            </ButtonGroup>
          </Box>
          <StatGroup>
            {Object.keys(list).map((key) => {
              const isActive = params.type === 'list' && params.status === key;
              return (
                <Stat
                  key={key}
                  as={PseudoButton}
                  backgroundColor={isActive ? 'gray.500' : null}
                  onClick={() =>
                    handleChangeParams({ type: 'list', status: key })
                  }
                >
                  <StatNumber>{list[key]}</StatNumber>
                  <StatHelpText textTransform="uppercase">{key}</StatHelpText>
                </Stat>
              );
            })}
          </StatGroup>
        </>
      )}
    </Box>
  );
};

const JobItem = ({ item, type, onCommand }) => {
  const jobCommands = [
    'retry',
    'remove',
    'promote',
    'discard',
    'moveToCompleted',
    'moveToFailed',
  ];
  const toast = useToast();
  const handleCommand = async (command) => {
    try {
      await updateJob({ command, id: item.id, type });
      onCommand();
    } catch (error) {
      toast({
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box borderBottom="1px" as={PseudoBox} borderColor="gray.200" py={2}>
      <Box d="flex" alignItems="space-between" width="100%">
        <Box d="flex" justifyContent="flex-start" flex="1">
          <Text fontWeight="bold">ID: </Text>
          <Text mx={2}>{item.id}</Text>
        </Box>
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton isActive={isOpen} variant="ghost" as={Button}>
                <Icon
                  name="settings"
                  css={{
                    transform: isOpen ? 'rotate(30deg)' : 'rotate(0)',
                    transition: `transform 0.2s ease-in-out`,
                  }}
                />
              </MenuButton>
              <MenuList>
                {jobCommands.map((command) => {
                  return (
                    <MenuItem
                      onClick={() => handleCommand(command)}
                      key={command}
                      css={{ textTransform: 'uppercase', marginRight: 2 }}
                    >
                      {command}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </>
          )}
        </Menu>
      </Box>
      <Box d="flex" alignItems="space-between" width="100%">
        {Object.keys(item.data).map((key) => {
          return (
            <>
              <Text fontWeight="bold" fontSize="xs" key={key}>
                {key}:{' '}
              </Text>
              <Text mx={2} fontSize="xs">
                {item.data[key]}
              </Text>
            </>
          );
        })}
      </Box>
      <Box d="flex" alignItems="flex-start" width="100%">
        <Text fontWeight="bold" fontSize="xs">
          Processed On:
        </Text>
        <Text mx={2} fontSize="xs">
          {format(new Date(item.processedOn), DATE_FORMAT)}
        </Text>
      </Box>
      {item.finishedOn && (
        <Box d="flex" alignItems="flex-start" width="100%">
          <Text fontWeight="bold" fontSize="xs">
            Finished On:
          </Text>
          <Text mx={2} fontSize="xs">
            {format(new Date(item.finishedOn), DATE_FORMAT)}
          </Text>
        </Box>
      )}
      {item.failedReason && (
        <Box d="flex" alignItems="flex-start" width="100%">
          <Text fontWeight="bold" fontSize="xs">
            Failed reason:
          </Text>
          <Text mx={2} fontSize="xs">
            {item.failedReason}
          </Text>
        </Box>
      )}
    </Box>
  );
};

const JobsDataGrid = ({ params, handleChangeParams }) => {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    countData: { data: countData },
  } = getJobsState(useGlobalState());

  const count =
    (countData &&
      countData[params.type] &&
      countData[params.type][params.status]) ||
    0;

  const currentPage = Math.ceil(params.skip / params.limit) + 1;
  const totalPages = Math.ceil(count / params.limit);

  const pages = [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ].filter((page) => page <= totalPages && page > 0);

  const fetchData = async (refetch = false) => {
    try {
      setIsLoading(true);
      const res = await fetchJobs(params, refetch);
      setData(res);
    } catch (error) {
      toast({
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleChangePage = (page) => {
    const skip = params.limit * (page - 1);
    handleChangeParams({ skip });
  };

  return (
    <Box d="block" mb={8} borderWidth="1px" p={2}>
      <Box mb={4}>
        <Heading size="md">Jobs</Heading>
        <Text color="gray.500">Type: {params.type}</Text>
        <Text color="gray.500">Status: {params.status}</Text>
      </Box>
      <Box>
        {isLoading && (
          <Box
            d="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
          >
            <Spinner size="xl" />
          </Box>
        )}
        {!isLoading &&
          data.map((job) => {
            return (
              <JobItem
                item={job}
                key={job.id}
                type={params.type}
                onCommand={() => fetchData(true)}
              />
            );
          })}
        {!isLoading && data.length < 1 && (
          <Box
            d="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
          >
            <Icon name="warning-2" mr={2} />
            <Heading size="s">Nothing.</Heading>
          </Box>
        )}
      </Box>
      <Box d="flex" alignItems="center" py={2} justifyContent="space-between">
        <Text>Total pages: {totalPages}</Text>
        <ButtonGroup spacing={2}>
          {currentPage > 3 && (
            <>
              <Button
                borderColor="teal.300"
                onClick={() => handleChangePage(1)}
              >
                1
              </Button>
              <Text as="span" flex="1" mx={2}>
                ...
              </Text>
            </>
          )}
          {pages.map((page) => (
            <Button
              borderWidth={page === currentPage ? '2px' : null}
              borderColor="teal.300"
              key={page}
              onClick={() => handleChangePage(page)}
            >
              {page}
            </Button>
          ))}

          {currentPage < totalPages - 2 && totalPages !== 0 && (
            <>
              <Text as="span" flex="1" mr={2}>
                ...
              </Text>
              <Button
                borderColor="teal.300"
                onClick={() => handleChangePage(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
        </ButtonGroup>
      </Box>
    </Box>
  );
};

const Jobs = () => {
  const [params, setParams] = useState({
    type: 'route',
    status: 'active',
    skip: 0,
    limit: 25,
  });

  useLayout(Dashboard);
  useTitle(
    <>
      admin <Icon name="chevron-right" /> Jobs
    </>,
  );

  const handleChangeParams = (update) => {
    if (
      (update.type && update.type !== params.type) ||
      (update.status && update.status !== params.status)
    ) {
      update = { ...update, skip: 0, limit: 25 };
    }
    setParams({ ...params, ...update });
  };

  return (
    <DashboardWrapper>
      <JobsCountData params={params} handleChangeParams={handleChangeParams} />
      <JobsDataGrid params={params} handleChangeParams={handleChangeParams} />
    </DashboardWrapper>
  );
};

export default Jobs;
