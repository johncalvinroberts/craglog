import React, { useEffect } from 'react';
import { Box, Heading, Button, IconButton, useToast } from '@chakra-ui/core';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useHistory, Link } from 'react-router-dom';
import LoginLayout from '../components/LogInLayout';
import { performLogin } from '../states';
import { useDispatch } from '../components/State';
import Form, { TextField, PasswordField } from '../components/Form';
import { useTitle, useAuthState } from '../hooks';

const validationSchema = yup.object().shape({
  email: yup.string().email().required().min(5).max(250),
  password: yup.string().required().min(8).max(250),
});

const defaultValues = {
  email: '',
  password: '',
};

const LogIn = () => {
  useTitle('Login');
  const history = useHistory();
  const toast = useToast();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuthState();

  const formMethods = useForm({ validationSchema, defaultValues });

  const onSubmit = async (formValues) => {
    try {
      await dispatch(performLogin(formValues));
      toast({
        description: 'Welcome back.',
        duration: 5000,
        isClosable: true,
      });
      history.replace('/app');
    } catch (error) {
      toast({
        description: error.message || 'You entered something wrong',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast({
        description: 'You are already logged in to craglog',
        duration: 4000,
        isClosable: true,
      });
      history.replace('/app');
    }
  }, [history, isAuthenticated, toast]);

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
        </Box>
        <Heading>Log in to craglog</Heading>
      </Box>
      <Box w="100%" borderWidth="1px" rounded="sm" overflow="hidden" p="4">
        <Form
          onSubmit={onSubmit}
          methods={formMethods}
          defaultValues={defaultValues}
        >
          <TextField label="Email" name="email" input required />
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

      <Box pt={4} pb={4}>
        <Button
          variant="link"
          to="/register"
          as={Link}
          fontSize="sm"
          d="block"
          mb={2}
        >
          Not registered yet? Sign up here.
        </Button>
        <Button as={Link} to="/forgot-password" variant="link" fontSize="sm">
          Forgot your password?
        </Button>
      </Box>
    </LoginLayout>
  );
};

export default LogIn;
