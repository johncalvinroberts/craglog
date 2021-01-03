import React from 'react';
import { Box, PseudoBox, Text, Icon, Tooltip } from '@chakra-ui/core';

const RouteCard = ({
  route,
  showLink = true,
  showStyle = true,
  wrapperStyleProps = {},
  innerStyleProps = {},
}) => {
  return (
    <Box
      borderBottom="1px"
      as={PseudoBox}
      borderColor="gray.200"
      py={2}
      {...wrapperStyleProps}
    >
      <Box
        d="flex"
        width="100%"
        alignItems="baseline"
        {...innerStyleProps}
        flexWrap="wrap"
      >
        <Box
          d={['block', 'flex']}
          alignItems="baseline"
          flex={['0 0 100%', 'initial']}
        >
          <Text mr={1} fontSize={['xs', 'sm']} fontWeight="medium">
            {route.name}
          </Text>
          <Text mr={1} fontSize="xs">
            {route.grade}
          </Text>
          {showStyle && (
            <Text mr={1} fontSize="xs">
              {route.style && route.style.toUpperCase()}
            </Text>
          )}
        </Box>
        <Text mx={[0, 2]} fontSize="xs" flex="1" lineHeight="normal">
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
