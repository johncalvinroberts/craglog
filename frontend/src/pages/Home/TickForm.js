import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Button,
  Box,
  useToast,
  Input,
  Heading,
  Spinner,
  Text,
  PseudoBox,
} from '@chakra-ui/core';
import * as yup from 'yup';
import useSWR from 'swr';
import useDeepEffect from 'use-deep-compare-effect';
import { useForm } from 'react-hook-form';
import _get from 'lodash/get';
import Form from '../../components/Form';
import Map from '../../components/Map';
import EmptyView from '../../components/EmptyView';
import {
  tickStyleEnum,
  tickTypeEnum,
  outdoorStyleEnum,
  sportAndTradTickTypeEnum,
  topRopeTickTypeEnum,
  boulderTickTypeEnum,
  notesPlaceHolders,
} from '../../constants';
import { toggleMobileNav } from '../../states';
import { useDispatch } from '../../components/State';
import TextAreaField from '../../components/TextAreaField';
import SelectField from '../../components/SelectField';
import TextField from '../../components/TextField';
import SliderField from '../../components/SliderField';
import Marker from '../../components/Marker';
import RouteCard from '../../components/RouteCard';
import camelCaseToTitleCase from '../../utils/camelCaseToTitleCase';
import useGeoLocation from '../../hooks/useGeoLocation';
import useThrottle from '../../hooks/useThrottle';
import http from '../../http';
import calculateGeoDistance from '../../utils/calculateGeoDistance';

const getCoordsFromUserPosition = (position) => {
  if (!position) return null;
  return [position.coords.latitude, position.coords.longitude];
};

const getRouteCoords = (route) => _get(route, 'location.coordinates');

const getRouteQueryUrl = ({ center, throttledQuery }) => {
  if (!center && !throttledQuery) {
    return null;
  }
  if (center && !throttledQuery) {
    return `/route?origin=${center.join(',')}&take=10`;
  }
  if (throttledQuery && center) {
    return `/route?origin=${center.join(',')}&take=10&name=${throttledQuery}`;
  }
};

const notePlaceHolder =
  notesPlaceHolders[
    Math.floor(Math.random() * Math.ceil(notesPlaceHolders.length - 1))
  ];
const concatRoutesList = ({ currentRoute, queriedRoutes }) => {
  if (!currentRoute && !queriedRoutes) return undefined;
  if (currentRoute && !queriedRoutes) return [currentRoute];
  if (!currentRoute) return queriedRoutes;
  return queriedRoutes.reduce(
    (memo, current) => {
      if (current.id !== currentRoute.id) memo.push(current);
      return memo;
    },
    [currentRoute],
  );
};

const validationSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf(
      tickTypeEnum,
      'Please choose a type that describes your performance on this climb',
    )
    .when('style', {
      is: (val) => outdoorStyleEnum.includes(val),
      then: yup.string().required(),
    }),
  style: yup
    .string()
    .required()
    .oneOf(tickStyleEnum, 'Please choose a style'),
  routeId: yup.string().when('style', {
    is: (val) => outdoorStyleEnum.includes(val),
    then: yup
      .string()
      .required('Please choose a route')
      .typeError('Please choose a route'),
    otherwise: yup.string().nullable(),
  }),
  notes: yup.string().max(2000),
  tickDate: yup
    .date('Please choose a date')
    .required('Please choose a date')
    .typeError('Please choose a date')
    .max(new Date(), 'You cannot log a climb in the future'),
  physicalRating: yup.number().nullable(),
  gymName: yup.string().max(500),
  location: yup.string(),
});

const formatOptions = (arr) =>
  arr.map((item) => ({
    value: item,
    label: camelCaseToTitleCase(item),
  }));

const tickStyleOptions = formatOptions(tickStyleEnum);

const boulderTypeOptions = formatOptions(boulderTickTypeEnum);
const sportAndTradTypeOptions = formatOptions(sportAndTradTickTypeEnum);
const topRopTypeOptions = formatOptions(topRopeTickTypeEnum);
const allTickTypes = formatOptions(tickTypeEnum);

const tickTypeOptions = {
  boulder: boulderTypeOptions,
  trad: sportAndTradTypeOptions,
  sport: sportAndTradTypeOptions,
  solo: sportAndTradTypeOptions,
  toprope: topRopTypeOptions,
  other: allTickTypes,
};

// TickForrm -> main component entrypoint
const TickForm = ({ defaultValues, onSubmit }) => {
  const dispatch = useDispatch();

  const [center, setCenter] = useState();

  const [mapCenter, setMapCenter] = useState();

  const [query, setQuery] = useState('');

  const throttledQuery = useThrottle(query, 800);

  const formMethods = useForm({ validationSchema, defaultValues });

  const { watch, register, setValue, errors } = formMethods;

  const routeError = errors.routeId;

  const { style, routeId } = watch(['style', 'routeId']);

  const [position] = useGeoLocation();

  const userLocation = getCoordsFromUserPosition(position);

  const isOutdoor = outdoorStyleEnum.includes(style);

  const toast = useToast();

  const formRef = useRef();

  // fetch routes to show on map
  const { data: queriedRoutes, error } = useSWR(
    () => getRouteQueryUrl({ center, throttledQuery }),
    http.get,
  );

  const { data: currentRoute } = useSWR(
    () => routeId && `/route/${routeId}`,
    http.get,
  );

  const routes = useMemo(
    () => concatRoutesList({ currentRoute, queriedRoutes }),
    [queriedRoutes, currentRoute],
  );

  // show remote error in toast
  useEffect(() => {
    if (error)
      toast({ description: error.message, isClosable: true, status: 'error' });
  }, [error, toast]);

  // find center for map
  useDeepEffect(() => {
    function findCenterToSet() {
      if (mapCenter) {
        return mapCenter;
      }

      if (routeId) {
        return (
          routes && getRouteCoords(routes.find((route) => route.id === routeId))
        );
      }

      return userLocation;
    }

    setCenter(findCenterToSet());
  }, [routeId, setCenter, userLocation, mapCenter, routes]);

  useEffect(() => {
    register({ name: 'routeId' });
  }, []); //eslint-disable-line

  // toggle mobile nav on mount/unmount
  useEffect(() => {
    dispatch(toggleMobileNav(false));
    return () => dispatch(toggleMobileNav(true));
  }, [dispatch]);

  const handleMapChange = useCallback(
    ({ center: nextMapCenter }) => {
      const { lat, lng } = nextMapCenter;
      const distance = calculateGeoDistance([lat, lng], center);
      if (distance > 200) {
        setMapCenter([lat, lng]);
      }
    },
    [center],
  );

  const handleSelectRoute = (route) => {
    if (route.id === routeId) {
      setValue('routeId', null);
    } else {
      setValue('routeId', route.id);
      setCenter(getRouteCoords(route));
    }
  };
  console.log({ notePlaceHolder });
  return (
    <Form
      onSubmit={onSubmit}
      methods={formMethods}
      defaultValues={defaultValues}
      ref={formRef}
    >
      <Box>
        <Heading size="md">Info</Heading>
        <Text size="xs" mb={4} as="div" width="auto" height="auto">
          Fill in the basics about the climb you&apos;re loggin.
        </Text>
      </Box>
      <Box d="flex" justifyContent="space-between" flexWrap="wrap">
        <SelectField
          name="style"
          label="Style"
          options={tickStyleOptions}
          required
          helperText="What kind of climbing or workout did you do?"
        />
        <TextField
          name="tickDate"
          type="datetime-local"
          required
          label="Date &amp; Time"
        />
        {isOutdoor && (
          <SelectField
            name="type"
            label="Did you send?"
            required
            options={tickTypeOptions[style]}
            helperText="Select a type that describes your accomplishment or failure"
          />
        )}
        {style === 'gym' && <TextField name="gymName" label="Gym Name" />}
        <SliderField
          name="physicalRating"
          label="Physical Rating"
          helperText="Rate how you felt on this climb. How difficult was this climb for you?"
        />
        {isOutdoor && (
          <>
            <Box mt={2} mb={4}>
              <Box>
                <Heading size="md">Route</Heading>
                <Text size="xs" mb={1} as="div" width="auto" height="auto">
                  Choose a route from the map, or search for a route by name
                  below.
                </Text>
                <Text width="100%" as="div" color="red.500" mb={2}>
                  {routeError && routeError.message}
                </Text>
              </Box>
              <Map
                containerStyleProps={{ mb: 5 }}
                center={center}
                onChange={({ center }) => handleMapChange({ center })}
                containerRef={formRef}
              >
                {userLocation && (
                  <Marker
                    lat={userLocation[0]}
                    lng={userLocation[1]}
                    color="teal.300"
                    label="You are here"
                  />
                )}
                {routes &&
                  routes.map((route) => {
                    const [lat, lng] = getRouteCoords(route);
                    return (
                      <Marker
                        lat={lat}
                        lng={lng}
                        label={route.name}
                        key={route.id}
                        color="blue"
                        onClick={(event) => {
                          event.preventDefault();
                          handleSelectRoute(route);
                        }}
                      />
                    );
                  })}
              </Map>
              <Box mb={4}>
                <Input
                  placeholder="Search for routes"
                  onChange={(e) => setQuery(e.currentTarget.value)}
                  mb={2}
                />
                <Box>
                  {!routes && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      p={4}
                      width="100%"
                      flexWrap="wrap"
                    >
                      <Spinner size="xl" />
                      <Box flex="0 0 100%" mt={2} textAlign="center">
                        {!error && <Text>Loading routes 1 sec....</Text>}
                      </Box>
                    </Box>
                  )}
                  {routes &&
                    routes.map((route) => {
                      const isSelected = route.id === routeId;
                      return (
                        <PseudoBox
                          as="button"
                          display="block"
                          width="100%"
                          transition="all 0.2s ease"
                          key={route.id}
                          outline="none"
                          _hover={{
                            boxShadow: '0px 01px 0px black',
                          }}
                          onClick={(event) => {
                            event.preventDefault();
                            handleSelectRoute(route);
                          }}
                          {...(isSelected
                            ? {
                                backgroundColor: 'teal.300',
                                _hover: {
                                  boxShadow: 'none',
                                  opacity: '0.8',
                                },
                              }
                            : null)}
                        >
                          <RouteCard route={route} />
                        </PseudoBox>
                      );
                    })}
                  {routes && routes.length < 1 && (
                    <EmptyView message="No routes found." />
                  )}
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
      <Box>
        <Heading size="md">Notes</Heading>
        <Text size="xs" mb={4} as="div" width="auto" height="auto">
          Beta, or other noteworthy details about the climb for future
          reference.
        </Text>
      </Box>
      <TextAreaField name="notes" placeholder={notePlaceHolder} />
      <Box
        position="fixed"
        bottom="20px"
        maxWidth="100px"
        right="20px"
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
      >
        <Button
          backgroundColor="teal.300"
          variant="solid"
          type="submit"
          loadingText="Submitting"
          color="white"
          mb={2}
        >
          Save
        </Button>
      </Box>
    </Form>
  );
};

export default TickForm;
