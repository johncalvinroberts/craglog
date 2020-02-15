import React, { useState, useEffect } from 'react';
import {
  useToast,
  StatGroup,
  Box,
  Stat,
  StatNumber,
  StatHelpText,
  Spinner,
  Heading,
  ButtonGroup,
  Button,
} from '@chakra-ui/core';
import useSWR from 'swr';
import PseudoButton from '@/components/PseudoButton';
import http from '@/http';

const JobsCountData = ({ params, handleChangeParams }) => {
  const toast = useToast();
  const [buttonLoadingStates, setButtonLoadingStates] = useState({
    route: { pause: false, resume: false },
    list: { pause: false, resume: false },
  });

  const handleQueueCommand = async ({ type, command }) => {
    try {
      setButtonLoadingStates({
        ...buttonLoadingStates,
        [type]: { ...buttonLoadingStates[type], [command]: true },
      });

      await http.patch(`/job/queue`, { type, command });

      setButtonLoadingStates({
        ...buttonLoadingStates,
        [type]: { ...buttonLoadingStates[type], [command]: false },
      });
      toast({ description: `${type} update to ${command} success` });
    } catch (error) {
      toast({
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const { data: countData, error } = useSWR('/job/count', http.get);

  useEffect(() => {
    if (error) toast({ description: error.message, status: 'error' });
  }, [error, toast]);

  const { route = {}, list = {} } = countData || {};
  return (
    <Box d="block" mb={8} borderWidth="1px" p={2}>
      {!countData && <Spinner size="xl" />}
      {countData && (
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
                  _hover={{
                    borderColor: 'teal.300',
                  }}
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

export default JobsCountData;
