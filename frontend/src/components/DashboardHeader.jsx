import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Box, Flex, IconButton, useColorMode, Heading } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import { getUIState } from '../states';
import UtilMenu from './UtilMenu';
import { useGlobalState } from './State';

const utilBarOuterRef = { current: null };
const bg = { light: 'white', dark: 'gray.800' };

export const UtilBar = ({ children }) => {
  const { colorMode } = useColorMode();

  const contents = (
    <Box
      d="flex"
      justifyContent="flex-end"
      borderBottomWidth="1px"
      borderTopWidth="1px"
      ml={[0, 0, '18rem']}
      bg={bg[colorMode]}
      zIndex="4"
    >
      {children}
    </Box>
  );

  return ReactDOM.createPortal(contents, utilBarOuterRef.current);
};

const DashboardHeader = (props) => {
  const { colorMode } = useColorMode();
  const { Title } = getUIState(useGlobalState());
  const utilBarRef = useRef();

  useEffect(() => {
    utilBarOuterRef.current = utilBarRef.current;
  }, []);

  return (
    <>
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
              mr={2}
            >
              <IconButton
                variant="ghost"
                color="current"
                fontSize="30px"
                rounded="full"
                icon="logo"
              />
            </Box>
            <Heading size="xl">{Title}</Heading>
          </Flex>
          <Flex
            flex={{ xs: '1' }}
            align="center"
            color="gray.500"
            justify="flex-end"
          >
            <UtilMenu />
          </Flex>
        </Flex>
        <div ref={utilBarRef} />
      </Box>
      <Box mb={utilBarRef.current && utilBarRef.current.clientHeight} />
    </>
  );
};

export default DashboardHeader;
