import React, { forwardRef } from 'react';
import {
  Drawer,
  DrawerBody,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  Button,
  Box,
  Icon,
  MenuList,
  Menu,
  MenuButton,
  MenuItem,
} from '@chakra-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { SideNavContent } from './SideNav';
import useRouteChanged from '../hooks/useRouteChanged';
import useAuthState from '../hooks/useAuthState';

const MobileNavButton = forwardRef((props, ref) => (
  <Button
    ref={ref}
    backgroundColor="teal.300"
    variant="solid"
    color="white"
    borderRadius="50%"
    width="48px"
    height="48px"
    mb={2}
    {...props}
  >
    <Icon name="add" />
  </Button>
));

const MobileUtilMenu = () => {
  return (
    <>
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              isActive={isOpen}
              variant="ghost"
              as={MobileNavButton}
            />
            <MenuList>
              <MenuItem
                as={RouterLink}
                to="/app/log/new"
                aria-label="Add a log"
              >
                Add Log
              </MenuItem>
              <MenuItem
                as={RouterLink}
                to="/app/hangboard"
                aria-label="Hangboard trainer"
              >
                Hangboard
              </MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
    </>
  );
};

const MobileAdminMenu = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  useRouteChanged(onClose);
  return (
    <>
      <Button
        backgroundColor="teal.300"
        variant="solid"
        onClick={onToggle}
        color="white"
        mb={2}
      >
        Admin
      </Button>
      <Drawer
        size="xs"
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        id="mobile-nav"
        aria-labelledby="mobile-nav-button"
        role="menu"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody p={0}>
            <SideNavContent contentHeight="100vh" top="0" />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const MobileNav = () => {
  const { user } = useAuthState();
  const isAdmin = user.roles.includes('admin');
  return (
    <>
      <Box
        position="fixed"
        bottom="20px"
        maxWidth="100px"
        right="20px"
        d="flex"
        flexWrap="wrap"
        justifyContent="center"
      >
        <MobileUtilMenu />
        {isAdmin && <MobileAdminMenu />}
      </Box>
    </>
  );
};

export default MobileNav;
