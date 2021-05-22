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
import PseudoButton from '../../components/PseudoButton';
import http from '../../http';

const JobsCountData = ({ params, handleChangeParams }) => {
  const toast = useToast();
  const [buttonLoadingStates, setButtonLoadingStates] = useState({
    pause: false,
    resume: false,
  });

  const handleQueueCommand = async ({ command }) => {
    try {
      setButtonLoadingStates({
        ...buttonLoadingStates,
        [command]: true,
      });

      await http.patch(`/jobs/command`, { command });

      setButtonLoadingStates({
        ...buttonLoadingStates,
        [command]: false,
      });
      toast({ description: `update to ${command} success` });
    } catch (error) {
      toast({
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const { data: countData, error } = useSWR('/jobs/count', http.get);

  useEffect(() => {
    if (error) toast({ description: error.message, status: 'error' });
  }, [error, toast]);

  return (
    <Box d="block" mb={8} borderWidth="1px" p={2}>
      {!countData && <Spinner size="xl" />}
      {countData && (
        <>
          <Box d="flex" justifyContent="space-between">
            <Heading size="md" mb={4}>
              Scraping Queue
            </Heading>
            <ButtonGroup spacing={4}>
              <Button
                size="xs"
                border="2px"
                borderColor="teal.300"
                variant="solid"
                isLoading={buttonLoadingStates.pause}
                onClick={() => handleQueueCommand({ command: 'pause' })}
              >
                Pause
              </Button>
              <Button
                size="xs"
                border="2px"
                borderColor="teal.300"
                variant="solid"
                isLoading={buttonLoadingStates.resume}
                onClick={() => handleQueueCommand({ command: 'resume' })}
              >
                Resume
              </Button>
            </ButtonGroup>
          </Box>
          <StatGroup>
            {Object.keys(countData).map((key) => {
              const isActive = params.type === 'list' && params.status === key;
              return (
                <Stat
                  key={key}
                  as={PseudoButton}
                  backgroundColor={isActive ? 'gray.500' : null}
                  onClick={() => handleChangeParams({ status: key })}
                >
                  <StatNumber>{countData[key]}</StatNumber>
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
