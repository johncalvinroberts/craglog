import React from 'react';
import { Box, Flex, IconButton, useColorMode } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import MobileNav from './MobileNav';
import UtilMenu from './UtilMenu';

const DashboardHeader = (props) => {
  const { colorMode } = useColorMode();
  const bg = { light: 'white', dark: 'gray.800' };

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
          >
            <IconButton
              variant="ghost"
              color="current"
              fontSize="30px"
              rounded="full"
              icon="logo"
            />
          </Box>
        </Flex>
        <Flex
          flex={{ xs: '1' }}
          ml={5}
          align="center"
          color="gray.500"
          justify="flex-end"
        >
          <MobileNav />
          <UtilMenu />
        </Flex>
      </Flex>
    </Box>
  );
};

export default DashboardHeader;
