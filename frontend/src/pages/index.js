import React from 'react';
import { Box, Icon, Heading, Text, Link } from '@chakra-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const Landing = () => {
  return (
    <Box
      minHeight="100vh"
      width="100%"
      d="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        d="flex"
        flexWrap="wrap"
        padding={2}
        alignItems="center"
        justifyContent="center"
      >
        <Icon name="logo" size="300px" />
        <Box>
          <Heading textAlign="center" as="h1" size="2xl" mb={2}>
            Craglog
          </Heading>
          <Text fontSize="md" textAlign="center">
            Log your climbs
          </Text>
        </Box>
        <Box flex="0 0 100%" d="flex" justifyContent="center">
          <Link to="/login" as={RouterLink} mr={2}>
            login
          </Link>
          <Link to="/register" as={RouterLink}>
            register
          </Link>
        </Box>
        <Link to="/climbing-grade-converter" as={RouterLink} mt={3}>
          climbing grade converter utility 🧮 →
        </Link>
      </Box>
    </Box>
  );
};

export default Landing;
