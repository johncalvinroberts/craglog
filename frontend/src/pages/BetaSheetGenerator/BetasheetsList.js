import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/core';
import { useTitle } from '../../hooks';
import { QuietLink } from '../../components/Link';

const BetasheetsList = () => {
  useTitle('Betasheets');
  return (
    <Box d="block" mb={[4, 8]}>
      <Box
        d="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={[2, 4]}
      >
        <Box width="100%">
          <Box
            d="flex"
            justifyContent="space-between"
            mb={1}
            alignItems="center"
            width="100%"
          >
            <Heading size="md">Betasheet Builder</Heading>
            <QuietLink to="/app/betasheets/new" width="auto" height="auto">
              New
            </QuietLink>
          </Box>
          <Text size="xs" as="div" width="auto" height="auto" mb={2}>
            This is the Craglog betasheet builder. Build a detailed diagram of
            your project or a climb, and share, or keep secret.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default BetasheetsList;
