import React from 'react';
import { Box, Heading } from '@chakra-ui/core';
import { useAuthState } from '../hooks';
import { MenuLink } from './Link';

const NavGroupHeading = (props) => (
  <Heading
    fontSize="xs"
    color="gray.400"
    letterSpacing="wide"
    mb={2}
    textTransform="uppercase"
    {...props}
  />
);

export const SideNavContent = ({
  contentHeight = 'calc(100vh - 4rem)',
  ...props
}) => {
  const { isAdmin } = useAuthState();
  return (
    <Box
      top="4rem"
      position="relative"
      overflowY="auto"
      borderRightWidth="1px"
      {...props}
    >
      <Box
        as="nav"
        height={contentHeight}
        aria-label="Main navigation"
        fontSize="sm"
        p="6"
      >
        <Box mb="10">
          <MenuLink to="/app">Home</MenuLink>
          <MenuLink to="/app/tick/new">Add Log</MenuLink>
          <MenuLink to="/app/hangboard">Hangboard</MenuLink>
        </Box>
        {isAdmin && (
          <Box mb="10">
            <NavGroupHeading>Admin</NavGroupHeading>
            <Box mb="10">
              <MenuLink to="/admin/jobs">jobs</MenuLink>
              <MenuLink to="/admin/users">users</MenuLink>
              <MenuLink to="/admin/routes">routes</MenuLink>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const SideNavContainer = (props) => (
  <Box
    position="fixed"
    left="0"
    width="100%"
    height="100%"
    top="0"
    right="0"
    {...props}
  />
);

const SideNav = (props) => {
  return (
    <SideNavContainer {...props}>
      <SideNavContent />
    </SideNavContainer>
  );
};

export default SideNav;
