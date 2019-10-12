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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
} from '@chakra-ui/core';
import { useHistory, Link } from 'react-router-dom';
import MobileNav from './MobileNav';
import { useDispatch } from './State';
import { performLogout } from '../states';

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

const DashboardHeader = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = { light: 'white', dark: 'gray.800' };
  const dispatch = useDispatch();
  const history = useHistory();
  const toast = useToast();

  const handleLogout = () => {
    dispatch(performLogout());
    history.replace('/login');
    toast({
      duration: 5000,
      description: 'You have logged out',
      isClosable: true,
    });
  };

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
              aria-label={`Switch to ${
                colorMode === 'light' ? 'dark' : 'light'
              } mode`}
              variant="ghost"
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
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton isActive={isOpen} as={Button}>
                  <Icon
                    name="settings"
                    css={{
                      transform: isOpen ? 'rotate(30deg)' : 'rotate(0)',
                      transition: `transform 0.2s ease-in-out`,
                    }}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    aria-label={`Switch to ${
                      colorMode === 'light' ? 'dark' : 'light'
                    } mode`}
                    onClick={toggleColorMode}
                  >
                    <Icon
                      color="current"
                      name={colorMode === 'light' ? 'moon' : 'sun'}
                      mr="2"
                    />
                    <Box flex="1">
                      Switch to {colorMode === 'light' ? 'Dark' : 'Light'} Mode
                    </Box>
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    aria-label="Log out of craglog"
                  >
                    <Icon color="current" name="arrow-back" mr="2" />
                    <Box flex="1">Log Out</Box>
                  </MenuItem>
                </MenuList>
              </>
            )}
          </Menu>

          <MobileNav />
        </Flex>
      </Flex>
    </Box>
  );
};

export default DashboardHeader;
