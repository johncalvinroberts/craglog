import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Box, Heading, IconButton, useToast, Button } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import LoginLayout from '../components/LogInLayout';
import Form, { TextField } from '../components/Form';
import { useTitle } from '../hooks';
import { requestPasswordReset } from '../api';

const validationSchema = yup.object().shape({
  email: yup.string().email().required().min(5).max(250),
  password: yup.string().required().min(8).max(20),
});

const defaultValues = {
  email: '',
};

const ForgotPassword = () => {
  useTitle('Forgot Password');
  const toast = useToast();
  const formMethods = useForm({ defaultValues, validationSchema });

  const onSubmit = async (values) => {
    try {
      console.log({ values });
      await requestPasswordReset(values);
      toast({
        description:
          'We sent you an email. Please check it and follow the instructions to reset your password.',
      });
    } catch (error) {
      toast({
        description: error.message || 'You entered something wrong',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <LoginLayout>
      <Box mb={4} d="block">
        <Box
          as={Link}
          style={{ display: 'block' }}
          to="/"
          aria-label="Craglog, back to landing page"
          mr={2}
        >
          <IconButton
            variant="ghost"
            color="current"
            fontSize="40px"
            rounded="full"
            icon="logo"
          />
          <Heading>Forgot your password?</Heading>
        </Box>
        <Box my={4}>We will send you an email with instructions.</Box>
      </Box>
      <Box w="100%" borderWidth="1px" rounded="sm" overflow="hidden" p="4">
        <Form
          onSubmit={onSubmit}
          methods={formMethods}
          defaultValues={defaultValues}
        >
          <TextField label="Email" name="email" input required />
          <Box pt={3} pb={2}>
            <Button
              type="submit"
              loadingText="Submitting"
              border="2px"
              borderColor="teal.300"
              variant="solid"
            >
              Submit
            </Button>
          </Box>
        </Form>
      </Box>
    </LoginLayout>
  );
};

export default ForgotPassword;
