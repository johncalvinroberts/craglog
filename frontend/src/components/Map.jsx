import React, { useState, useEffect } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/core';
import GoogleMap from 'google-map-react';
import { useWindowSize } from '../hooks';
import { GOOGLE_MAPS_API_KEY, fallbackPosition } from '../constants';

const defaultWidth = ['24rem', '30rem', '30rem', '42rem', '46rem'];

const height = ['18rem', '20rem', '26rem', '32rem'];

export default ({
  children,
  containerStyleProps,
  center,
  error,
  containerRef,
  ...props
}) => {
  const [parentContainerWidth, setParentContainerWidth] = useState();

  const windowSize = useWindowSize();

  useEffect(() => {
    if (containerRef.current) {
      setParentContainerWidth(`${containerRef.current.clientWidth}px`);
    }
  }, [containerRef, windowSize]);

  return (
    <>
      <Box
        width={parentContainerWidth || defaultWidth}
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
          width={parentContainerWidth || defaultWidth}
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
