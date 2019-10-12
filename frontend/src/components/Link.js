import React, { cloneElement, forwardRef } from 'react';
import { Box, PseudoBox, useColorMode } from '@chakra-ui/core';
import { useLocation } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

const NavLink = ({ children, to, ...props }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <RouterLink {...props} to={to}>
      {typeof children === 'function' ? children(isActive) : children}
    </RouterLink>
  );
};

export const SideNavLink = forwardRef(({ children, icon, ...props }, ref) => {
  const { colorMode } = useColorMode();
  const color = { light: 'gray.700', dark: 'whiteAlpha.700' };
  return (
    <PseudoBox
      ref={ref}
      as="a"
      mx={-2}
      display="flex"
      cursor="pointer"
      align="center"
      px="2"
      py="1"
      transition="all 0.2s"
      fontWeight="medium"
      outline="none"
      _focus={{ shadow: 'outline' }}
      color={color[colorMode]}
      _notFirst={{ mt: 1 }}
      {...props}
    >
      {icon && cloneElement(icon, { mr: 3 })}
      <Box>{children}</Box>
    </PseudoBox>
  );
});

export const QuietLink = forwardRef(({ to, ...props }, ref) => {
  return (
    <NavLink to={to}>
      {(isActive) => (
        <SideNavLink
          ref={ref}
          aria-current={isActive ? 'page' : undefined}
          _hover={{ color: !isActive ? 'inherit' : null }}
          {...(isActive && { color: 'teal.500', fontWeight: 'semibold' })}
          {...props}
        />
      )}
    </NavLink>
  );
});

export const ListLink = forwardRef(({ to, ...props }, ref) => {
  const { colorMode } = useColorMode();
  const hoverColor = { light: 'gray.900', dark: 'whiteAlpha.900' };
  const activeColor = { light: 'teal.800', dark: 'teal.200' };

  return (
    <NavLink to={to}>
      {(isActive) => (
        <SideNavLink
          ref={ref}
          aria-current={isActive ? 'page' : undefined}
          _hover={{
            color: hoverColor[colorMode],
            transform: 'translateX(2px)',
          }}
          {...(isActive && {
            rounded: 'sm',
            color: activeColor[colorMode],
            _hover: {},
          })}
          {...props}
        />
      )}
    </NavLink>
  );
});
