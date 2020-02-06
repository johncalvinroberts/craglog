import React from 'react';
import { Box, Spinner, Text } from '@chakra-ui/core';
import GoogleMap from 'google-map-react';
import { GOOGLE_MAPS_API_KEY, fallbackPosition } from '../constants';

const width = ['24rem', '30rem', '30rem', '46rem'];
const height = ['18rem', '20rem', '26rem', '32rem'];
export default ({ children, containerStyleProps, center, error, ...props }) => {
  return (
    <>
      <Box
        width={width}
        height={height}
        display={center ? 'none' : 'flex'}
        justifyContent="center"
        alignItems="center"
        flex="0 0 100%"
        {...containerStyleProps}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
          <Spinner size="xl" />
          <Box flex="0 0 100%" mt={2}>
            {!error && <Text textAlign="center">Loading da map 1 sec....</Text>}
            {error && <Text color="error">{error.message}</Text>}
          </Box>
        </Box>
      </Box>
      {center && (
        <Box
          width={width}
          height={center ? height : '0'}
          opacity={center ? 1 : 0}
          {...containerStyleProps}
        >
          <GoogleMap
            bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
            defaultCenter={fallbackPosition}
            center={center}
            defaultZoom={5}
            {...props}
          >
            {children}
          </GoogleMap>
        </Box>
      )}
    </>
  );
};
