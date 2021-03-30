import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Box, Heading, IconButton, useToast, Button } from '@chakra-ui/core';

import LoginLayout from '../components/LogInLayout';
import Form, { PasswordField } from '../components/Form';
import { useTitle } from '../hooks';
import { submitPasswordReset } from '../api';

const validationSchema = yup.object().shape({
  password: yup.string().required(),
});

const defaultValues = {
  password: '',
};

// format should be reset?resetToken=token&email=someemail
const ForgotPassword = () => {
  useTitle('Reset Password');
  const toast = useToast();
  const history = useHistory();
  const formMethods = useForm({ defaultValues, validationSchema });

  const onSubmit = async (values) => {
    const params = new URLSearchParams(window.location.search);
    try {
      await submitPasswordReset({
        ...values,
        resetToken: params.get('resetToken'),
      });
      toast({
        description: 'Your password has been successfully reset',
      });
      history.push('/login');
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
          <Heading>Reset Your Password</Heading>
        </Box>
      </Box>
      <Box w="100%" borderWidth="1px" rounded="sm" overflow="hidden" p="4">
        <Form
          onSubmit={onSubmit}
          methods={formMethods}
          defaultValues={defaultValues}
        >
          <PasswordField label="Password" name="password" required />
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
