import React from 'react';
import {
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  useColorMode,
} from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import MobileNav from './MobileNav';

const SearchBox = (props) => (
  <InputGroup {...props}>
    <InputLeftElement>
      <Icon name="search" color="gray.500" />
    </InputLeftElement>
    <Input
      variant="filled"
      placeholder="Search the docs "
      _focusBorderColor="teal"
      _placeholder={{ color: 'gray.500', opacity: 1 }}
      rounded="lg"
    />
  </InputGroup>
);

const DocsHeader = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();
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
            to="/"
            aria-label="Craglog, back to homepage"
          >
            <IconButton
              aria-label={`Switch to ${
                colorMode === 'light' ? 'dark' : 'light'
              } mode`}
              variant="ghost"
              to="/"
              color="current"
              fontSize="30px"
              rounded="full"
              icon="logo"
            />
          </Box>
        </Flex>
        <SearchBox
          display={{ sm: 'none', md: 'block' }}
          visibility="hidden"
          maxWidth="3xl"
          mx="auto"
          flex="1"
        />
        <Flex
          flex={{ sm: '1', md: 'none' }}
          ml={5}
          align="center"
          color="gray.500"
          justify="flex-end"
        >
          <IconButton
            aria-label={`Switch to ${
              colorMode === 'light' ? 'dark' : 'light'
            } mode`}
            variant="ghost"
            color="current"
            ml="2"
            fontSize="20px"
            onClick={toggleColorMode}
            icon={colorMode === 'light' ? 'moon' : 'sun'}
          />
          <MobileNav />
        </Flex>
      </Flex>
    </Box>
  );
};

export default DocsHeader;
