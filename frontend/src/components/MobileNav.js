import React from 'react';
import {
  Drawer,
  DrawerBody,
  Button,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/core';
import { SideNavContent } from './SideNav';
import useRouteChanged from '@/hooks/useRouteChanged';

const MobileNav = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  useRouteChanged(onClose);

  return (
    <>
      <Button
        display={{ sm: 'inline-flex', md: 'none' }}
        aria-label="Navigation Menu"
        fontSize="20px"
        variant="ghost"
        onClick={onToggle}
      />
      <Drawer size="xs" isOpen={isOpen} placement="left" onClose={onClose}>
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
