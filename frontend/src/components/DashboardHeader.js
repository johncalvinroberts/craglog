import React from 'react';
import { Box, Flex, IconButton, useColorMode, Heading } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import UtilMenu from './UtilMenu';
import { useGlobalState } from './State';
import { getUIState } from '../states';

const DashboardHeader = (props) => {
  const { colorMode } = useColorMode();
  const bg = { light: 'white', dark: 'gray.800' };
  const { Title } = getUIState(useGlobalState());

  return (
    <Box
      pos="fixed"
      as="header"
      top="0"
      zIndex="4"
      bg={bg[colorMode]}
      left="0"
      right="0"
      borderBottomWidth="1px"
      width="full"
      height="4rem"
      {...props}
    >
      <Flex size="100%" px="6" align="center">
        <Flex align="center" mr={5}>
          <Box
            as={Link}
            style={{ display: 'block' }}
            to="/app"
            aria-label="Craglog, back to homepage"
            mr={2}
          >
            <IconButton
              variant="ghost"
              color="current"
              fontSize="30px"
              rounded="full"
              icon="logo"
            />
          </Box>
          <Heading size="xl">{Title}</Heading>
        </Flex>
        <Flex
          flex={{ xs: '1' }}
          align="center"
          color="gray.500"
          justify="flex-end"
        >
          <UtilMenu />
        </Flex>
      </Flex>
    </Box>
  );
};

export default DashboardHeader;
