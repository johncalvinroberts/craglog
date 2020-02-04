import React, { useState } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/core';
import GoogleMap from 'google-map-react';
import { GOOGLE_MAPS_API_KEY } from '../constants';

export default ({ children, containerStyleProps, center, error }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <>
      <Box
        width="46rem"
        height={['20rem', '26rem', '36rem']}
        display={isLoaded && center ? 'none' : 'flex'}
        justifyContent="center"
        alignItems="center"
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
            {!error && <Text>Loading da map 1 sec....</Text>}
            {error && <Text color="error">Loading da map 1 sec....</Text>}
          </Box>
        </Box>
      </Box>
      {center && (
        <Box
          width="46rem"
          height={isLoaded ? ['20rem', '26rem', '36rem'] : '0'}
          opacity={isLoaded ? 1 : 0}
          {...containerStyleProps}
        >
          <GoogleMap
            bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
            yesIWantToUseGoogleMapApiInternals
            defaultCenter={[37.8651, 119.5383]}
            center={center}
            defaultZoom={10}
            onGoogleApiLoaded={() => handleLoaded()}
          >
            {children}
          </GoogleMap>
        </Box>
      )}
    </>
  );
};
