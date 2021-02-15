import React, { useEffect } from 'react';
import {
  useToast,
  Box,
  Spinner,
  Icon,
  Button,
  Text,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
  useDisclosure,
  Collapse,
  useColorMode,
} from '@chakra-ui/core';
import format from 'date-fns/format';
import useSWR from 'swr';
import { DATE_FORMAT } from '../../constants';
import http from '../../http';

const JobLogs = ({ item }) => {
  const { colorMode } = useColorMode();
  const logsBg = { light: 'gray.200', dark: 'gray.900' };
  const toast = useToast();
  const { data, error } = useSWR(`/jobs/${item.id}`, http.get);

  useEffect(() => {
    if (error) toast({ message: error.message, status: 'error' });
  }, [error, toast]);
  if (!data) return <Spinner />;

  return (
    <Box backgroundColor={logsBg[colorMode]} p={2}>
      <Box>{JSON.stringify(data)}</Box>
      {item.stacktrace &&
        item.stacktrace.map((t) => {
          return (
            <Box key={t} overflowWrap="break-word">
              {t}
            </Box>
          );
        })}
    </Box>
  );
};

const JobItem = ({ item, revalidate }) => {
  const jobCommands = [
    'retry',
    'remove',
    'promote',
    'discard',
    'moveToCompleted',
    'moveToFailed',
  ];
  const toast = useToast();
  const { isOpen: isLogsOpen, onToggle } = useDisclosure();

  const handleCommand = async (command) => {
    try {
      await http.patch(`/jobs/${item.id}`, { command });
      revalidate();
    } catch (error) {
      toast({
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };
  let failedReason;
  try {
    failedReason = item.failedReason && JSON.parse(item.failedReason);
  } catch (error) {
    // swallow error
  }
  return (
    <Box borderBottom="1px" borderColor="gray.200" py={2}>
      <Box d="flex" width="100%">
        <Box flex="1">
          <Box d="flex" alignItems="flex-start" width="100%">
            <Text fontWeight="bold" fontSize="xs">
              ID:
            </Text>
            <Text mx={2} fontSize="xs">
              {item.id}
            </Text>
          </Box>
          {Object.keys(item.data).map((key) => {
            return (
              <Box d="flex" alignItems="flex-start" width="100%" key={key}>
                <Text fontWeight="bold" fontSize="xs">
                  {key}:{' '}
                </Text>
                <Text mx={2} fontSize="xs">
                  {item.data[key]}
                </Text>
              </Box>
            );
          })}
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
          <Box d="flex" alignItems="flex-start" width="100%">
            <Text fontWeight="bold" fontSize="xs">
              Attempts Made:
            </Text>
            <Text mx={2} fontSize="xs">
              {item.attemptsMade}
            </Text>
          </Box>
          {failedReason && (
            <Box d="flex" alignItems="flex-start" width="100%">
              <Text fontWeight="bold" fontSize="xs">
                Failed reason:
              </Text>
              <Text mx={2} fontSize="xs">
                {failedReason.error}
              </Text>
            </Box>
          )}
        </Box>
        <Box
          d="flex"
          alignItems="space-between"
          flex="0 0 50px"
          flexDirection="column"
        >
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
          <IconButton icon="chevron-down" variant="ghost" onClick={onToggle} />
        </Box>
      </Box>
      <Collapse isOpen={isLogsOpen} width="100%">
        {isLogsOpen && <JobLogs item={item} />}
      </Collapse>
    </Box>
  );
};

export default JobItem;
