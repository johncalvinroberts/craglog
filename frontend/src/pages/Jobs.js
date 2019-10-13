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
} from '@chakra-ui/core';
import useLayout from '@/hooks/useLayout';
import useTitle from '@/hooks/useTitle';
import useInterval from '@/hooks/useInterval';
import Dashboard from '@/layouts/Dashboard';
import DashboardWrapper from '@/components/DashboardWrapper';
import { getJobsState, getCountData } from '@/states';
import { useDispatch, useGlobalState } from '@/components/State';
import { updateQueue, fetchJobs } from '@/api';

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

const JobItem = ({ item }) => {
  return (
    <Box borderBottom="1px" as={PseudoBox} borderColor="gray.200">
      {JSON.stringify(item)}
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

  const currentPage = params.skip / params.limit + 1;
  const totalPages = Math.ceil(count / params.limit);

  const pages = [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ].filter((page) => page <= totalPages + 1 && page > 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchJobs(params);
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
    fetchData();
  }, [params]);

  const handleChangePage = (page) => {
    const skip = params.limit / (page - 1);
    console.log({ skip, page });

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
            return <JobItem item={job} key={job.id} />;
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

          {currentPage !== totalPages && totalPages !== 0 && (
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
