import React, { cloneElement, forwardRef } from 'react';
import { PseudoBox, useColorMode, Text } from '@chakra-ui/core';
import { useLocation } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

const NavLink = ({ children, to, ...props }) => {
  const { pathname } = useLocation();
  const isActive = to === '/app' ? pathname === to : pathname.startsWith(to);

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
      <Text fontSize="xl">
        {children}
        {icon && cloneElement(icon, { ml: 2 })}
      </Text>
    </PseudoBox>
  );
});

export const MenuLink = forwardRef(({ to, ...props }, ref) => {
  const { colorMode } = useColorMode();
  const hoverColor = { light: 'gray.900', dark: 'whiteAlpha.900' };
  const activeColor = { light: 'teal.400', dark: 'teal.200' };
  const bg = { light: 'white', dark: 'whiteAlpha.100' };

  return (
    <NavLink to={to}>
      {(isActive) => (
        <SideNavLink
          ref={ref}
          aria-current={isActive ? 'page' : undefined}
          borderRadius="2px"
          _hover={{
            color: hoverColor[colorMode],
            transform: 'translateX(2px)',
            backgroundColor: bg[colorMode],
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

const QuietText = ({ children, ...rest }) => {
  const { colorMode } = useColorMode();
  const hoverColor = { light: 'teal.400', dark: 'teal.200' };
  return (
    <PseudoBox
      display="inline-block"
      as={Text}
      _hover={{ color: hoverColor[colorMode], transform: 'translateX(2px)' }}
      size="xs"
      transition="all 0.2s"
      _after={{
        content: '"→"',
        marginLeft: '3px',
        verticalAlign: 'middle',
      }}
      {...rest}
    >
      {children}
    </PseudoBox>
  );
};

export const QuietLink = ({ to, children, ...rest }) => {
  return (
    <QuietText as={RouterLink} to={to} {...rest}>
      {children}
    </QuietText>
  );
};
