import React from 'react';
import {
  Drawer,
  DrawerBody,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  IconButton,
} from '@chakra-ui/core';
import { SideNavContent } from './SideNav';
import useRouteChanged from '../hooks/useRouteChanged';

const MobileNav = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  useRouteChanged(onClose);

  return (
    <>
      <IconButton
        display={{ sm: 'inline-flex', md: 'none' }}
        aria-label="Navigation Menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
        id="mobile-nav-button"
        fontSize="20px"
        variant="ghost"
        isActive={isOpen}
        onClick={onToggle}
        marginRight={2}
        icon="menu"
      />
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

export default MobileNav;
