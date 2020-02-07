import React from 'react';
import { Box, PseudoBox, Text, Icon, Tooltip } from '@chakra-ui/core';

const RouteCard = ({ route, showLink = true, showStyle = true }) => {
  return (
    <Box borderBottom="1px" as={PseudoBox} borderColor="gray.200" py={2}>
      <Box d="flex" width="100%" alignItems="center">
        <Box flex="1" d="flex" alignItems="center">
          <Text mr={1} fontSize={['xs', 'sm']}>
            {route.name}
          </Text>
          <Tooltip label="grade">
            <Text mr={1} fontSize="xs">
              <Icon name="grade" mr={1} />
              {route.grade}
            </Text>
          </Tooltip>
          {showStyle && (
            <Tooltip label="style">
              <Text mr={1} fontSize="xs">
                {route.style && route.style.toUpperCase()}
              </Text>
            </Tooltip>
          )}
        </Box>
        <Text mx={2} fontSize="xs" flex="1">
          <span>
            {route.region} <Icon name="chevron-right" />{' '}
          </span>
          <span>
            {route.area} <Icon name="chevron-right" />{' '}
          </span>
          <span>{route.cragName}</span>
        </Text>
        {showLink && (
          <Box>
            <Tooltip label="View on thecrag.com">
              <Text
                href={`https://thecrag.com/route/${route.externalId}`}
                target="_blank"
                as="a"
                fontSize="xs"
                color="teal.400"
                rel="noopener noreferrer"
              >
                <Icon name="link" />
              </Text>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RouteCard;
