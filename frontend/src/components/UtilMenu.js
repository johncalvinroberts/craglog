import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  useToast,
  Menu,
  MenuList,
  MenuItem,
  Button,
  Icon,
  MenuButton,
  useColorMode,
  Box,
} from '@chakra-ui/core';
import { useDispatch } from './State';
import { performLogout } from '../states';

const UtilMenu = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
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
            <MenuItem onClick={handleLogout} aria-label="Log out of craglog">
              <Icon color="current" name="arrow-back" mr="2" />
              <Box flex="1">Log Out</Box>
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default UtilMenu;
