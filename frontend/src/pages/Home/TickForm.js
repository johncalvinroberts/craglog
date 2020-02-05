import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  useToast,
  Input,
  Heading,
  Spinner,
} from '@chakra-ui/core';
import * as yup from 'yup';
import useSWR from 'swr';
import useDeepEffect from 'use-deep-compare-effect';
import { useForm } from 'react-hook-form';
import _get from 'lodash/get';
import Form from '../../components/Form';
import Map from '../../components/Map';
import { tickStyleEnum, tickTypeEnum, outdoorStyleEnum } from '../../constants';
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

const getCoordsFromUserPosition = (position) => {
  if (!position) return null;
  return [position.coords.latitude, position.coords.longitude];
};

const getRouteCoords = (route) => _get(route, 'location.coordinates');

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
  routeId: yup.string(),
  notes: yup.string().max(2000),
  tickDate: yup
    .date('Please choose a date')
    .required('Please choose a date')
    .typeError('Please choose a date')
    .max(
      new Date(),
      `You can't log a climb in the future! Gotta climb it first! This is why the purists hate on us.`,
    ),
  physicalRating: yup.number().nullable(),
  gymName: yup.string().max(500),
  location: yup.string(),
});

const tickStyleOptions = tickStyleEnum.map((item) => ({
  value: item,
  label: camelCaseToTitleCase(item),
}));

const tickTypeOptions = tickTypeEnum.map((item) => ({
  value: item,
  label: camelCaseToTitleCase(item),
}));

// TickForrm -> main component entrypoint
const TickForm = ({ defaultValues, onSubmit }) => {
  const dispatch = useDispatch();

  const [center, setCenter] = useState();

  const [query, setQuery] = useState('');

  const throttledQuery = useThrottle(query, 800);

  const formMethods = useForm({ validationSchema, defaultValues });

  const { watch } = formMethods;

  const { style, route } = watch(['style', 'route']);

  const [position] = useGeoLocation();

  const userLocation = getCoordsFromUserPosition(position);

  const isOutdoor = outdoorStyleEnum.includes(style);

  const toast = useToast();

  // fetch routes to show on map
  const { data: routes, error } = useSWR(
    () => center && `/route?origin=${center.join(',')}&take=10`,
    http.get,
  );

  // show remote error in toast
  useEffect(() => {
    if (error) toast({ description: error.message, isClosable: true });
  }, [error, toast]);

  // find center for map
  useDeepEffect(() => {
    function findCenterToSet() {
      if (route) {
        return getRouteCoords(route);
      }

      return userLocation;
    }

    setCenter(findCenterToSet());
  }, [route, setCenter, userLocation]);

  // toggle mobile nav on mount/unmount
  useEffect(() => {
    dispatch(toggleMobileNav(false));
    return () => dispatch(toggleMobileNav(true));
  }, [dispatch]);

  return (
    <Form
      onSubmit={onSubmit}
      methods={formMethods}
      defaultValues={defaultValues}
    >
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
          <>
            <SelectField
              name="type"
              label="Did you send?"
              required
              options={tickTypeOptions}
              helperText="Select a type that describes your accomplishment or failure"
            />
            <Box mt={2}>
              <Map containerStyleProps={{ mb: 5 }} center={center}>
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
                        color="blue"
                        label={route.name}
                        key={route.id}
                      />
                    );
                  })}
              </Map>
              <Box mb={4}>
                <Heading size="md" mb={2}>
                  Route
                </Heading>
                <Input
                  placeholder="Search for routes"
                  onChange={(e) => setQuery(e.currentTarget.value)}
                />
                <Box>
                  {!routes && (
                    <Box
                      displayu="flex"
                      justifyContent="center"
                      alignItems="center"
                      p={4}
                    >
                      <Spinner size="xl" />
                    </Box>
                  )}
                  {routes &&
                    routes.map((route) => {
                      return <RouteCard route={route} key={route.id} />;
                    })}
                </Box>
              </Box>
            </Box>
          </>
        )}
        {style === 'gym' && <TextField name="gymName" label="Gym Name" />}
      </Box>
      <SliderField
        name="physicalRating"
        label="Physical Rating"
        helperText="Rate how you felt on this climb. How difficult was this climb for you?"
      />
      <TextAreaField
        name="notes"
        label="Notes"
        helperText="Beta, or other noteworthy details about the climb for future reference."
      />
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
