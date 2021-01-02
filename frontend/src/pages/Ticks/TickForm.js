import React, { useEffect, useState, useRef } from 'react';
import { Button, Box, useToast, Heading, Text } from '@chakra-ui/core';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import {
  tickStyleEnum,
  tickTypeEnum,
  outdoorStyleEnum,
  sportAndTradTickTypeEnum,
  topRopeTickTypeEnum,
  boulderTickTypeEnum,
  notesPlaceHolders,
} from '../../constants';
import Form, {
  TextAreaField,
  SelectField,
  TextField,
  SliderField,
} from '../../components/Form';
import RouteCard from '../../components/RouteCard';
import { toggleMobileNav } from '../../states';
import { useDispatch } from '../../components/State';
import { UtilBar } from '../../components/DashboardHeader';
import { camelCaseToTitleCase, delay } from '../../utils';
import http from '../../http';

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
  style: yup.string().required().oneOf(tickStyleEnum, 'Please choose a style'),
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
  routeSnapshot: yup.object().shape({
    externalUrl: yup.string().url().nullable(),
    area: yup.string(),
    bolts: yup.number().nullable(),
    cragName: yup.string().nullable(),
    grade: yup.string().nullable(),
    height: yup.string().nullable(),
    location: yup.array().of(yup.string()).nullable(),
    name: yup.string().nullable(),
    region: yup.string().nullable(),
    style: yup.string().nullable(),
  }),
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

const notePlaceHolder =
  notesPlaceHolders[
    Math.floor(Math.random() * Math.ceil(notesPlaceHolders.length - 1))
  ];

const fieldsToManuallyRegister = [
  'routeSnapshot.area',
  'routeSnapshot.bolts',
  'routeSnapshot.cragName',
  'routeSnapshot.grade',
  'routeSnapshot.height',
  'routeSnapshot.location',
  'routeSnapshot.name',
  'routeSnapshot.region',
  'routeSnapshot.style',
];

// TickForrm -> main component entrypoint
const TickForm = ({ defaultValues, onSubmit }) => {
  const dispatch = useDispatch();
  const [isImporting, setIsImporting] = useState();
  const [importJobId, setImportJobId] = useState(null);

  const formMethods = useForm({ validationSchema, defaultValues });

  const { watch, setValue, register } = formMethods;

  const { style, routeSnapshot } = watch(['style', 'routeSnapshot']);
  const isOutdoor = outdoorStyleEnum.includes(style);
  const externalUrl = routeSnapshot?.externalUrl;

  const formRef = useRef();
  const importJobIdRef = useRef();
  const toast = useToast();

  const handleImport = async () => {
    try {
      setIsImporting(true);
      const { id } = await http.post(`/jobs`, { url: externalUrl });
      setImportJobId(id);
    } catch (error) {
      setIsImporting(false);
      toast({
        description: error.message || 'Something broke',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  // toggle mobile nav on mount/unmount
  useEffect(() => {
    dispatch(toggleMobileNav(false));
    return () => dispatch(toggleMobileNav(true));
  }, [dispatch]);

  useEffect(() => {
    async function poll(id) {
      try {
        const job = await http.get(`/jobs/${id}`);
        if (!job.finishedOn) {
          await delay(1000);
          return poll(id);
        }
        const routeSnapshot = job?.returnvalue;
        setValue('routeSnapshot', routeSnapshot);
        setIsImporting(false);
      } catch (error) {
        toast({ description: error.message || 'Something broke' });
      }
    }
    importJobIdRef.current = importJobId;
    if (importJobId) {
      poll(importJobId);
    }
  }, [importJobId, toast, setValue]);

  useEffect(() => {
    // eslint-disable-next-line
    for (const field of fieldsToManuallyRegister) register(field);
  }, [register]);
  return (
    <Form
      onSubmit={onSubmit}
      methods={formMethods}
      defaultValues={defaultValues}
      ref={formRef}
      id="tick-form"
    >
      <UtilBar>
        <Button
          backgroundColor="teal.300"
          variant="solid"
          type="submit"
          loadingText="Submitting"
          color="white"
          form="tick-form"
          borderRadius="0"
          _hover={{ backgroundColor: 'teal.400' }}
        >
          Save
        </Button>
      </UtilBar>
      <Box>
        <Heading size="md">Info</Heading>
        <Text size="xs" mb={4} as="div" width="auto" height="auto">
          Fill in the basics about the climb you&apos;re logging.
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
          <>
            <SelectField
              name="type"
              label="Did you send?"
              required
              options={tickTypeOptions[style]}
              helperText="Select a type that describes your accomplishment or failure"
            />
          </>
        )}
        {style === 'gym' && <TextField name="gymName" label="Gym Name" />}
        <SliderField
          name="physicalRating"
          label="Physical Rating"
          helperText="Rate how you felt on this climb. How difficult was this climb for you?"
        />
        {isOutdoor && (
          <Box>
            <Heading size="md">Import Route</Heading>
            {routeSnapshot && !isImporting && routeSnapshot.name && (
              <Box mb={2}>
                <RouteCard route={routeSnapshot} />
              </Box>
            )}
            <Box my={4} d="flex">
              <TextField
                placeholder="Enter URL"
                name="routeSnapshot.externalUrl"
                disabled={isImporting}
              />
              <Button
                ml={2}
                disabled={!externalUrl || isImporting}
                onClick={handleImport}
                isLoading={isImporting}
              >
                Import
              </Button>
            </Box>
          </Box>
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
    </Form>
  );
};

export default TickForm;
