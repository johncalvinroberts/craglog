import React, { useEffect } from 'react';
import {
  Box,
  Heading,
  Icon,
  Button,
  useDisclosure,
  InputRightElement,
  IconButton,
  useToast,
} from '@chakra-ui/core';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useHistory, Link } from 'react-router-dom';
import useLayout from '../hooks/useLayout';
import useTitle from '../hooks/useTitle';
import { useDispatch } from '../components/State';
import LoginLayout from '../layouts/LogIn';
import TextField from '../fields/TextField';
import Form from '../components/Form';
import { performRegistration, performLogin } from '../states';
import useAuthState from '../hooks/useAuthState';

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .min(6)
    .max(250),
  email: yup
    .string()
    .email()
    .required()
    .min(5)
    .max(250),
  password: yup
    .string()
    .required()
    .min(8)
    .max(20),
});

const defaultValues = {
  username: '',
  email: '',
  password: '',
};

// TODO: terms & conditions, privacy etc.

const Register = () => {
  useLayout(LoginLayout);
  useTitle('Register');
  const { isAuthenticated } = useAuthState();

  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast();
  const history = useHistory();

  const dispatch = useDispatch();

  const formMethods = useForm({ defaultValues, validationSchema });

  const onSubmit = async (formValues) => {
    try {
      await dispatch(performRegistration(formValues));
      await dispatch(
        performLogin({
          email: formValues.email,
          password: formValues.password,
        }),
      );
      toast({
        title: "You're in",
        description: 'Welcome to the crag.',
        duration: 5000,
        isClosable: true,
      });
      history.replace('/app');
    } catch (error) {
      toast({
        description: error.message,
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
    <>
      <Box mb={4} d="block">
        <Icon name="logo" size="60px" />
        <Heading>Join craglog</Heading>
      </Box>
      <Box w="100%" borderWidth="1px" rounded="sm" overflow="hidden" p="4">
        <Form methods={formMethods} onSubmit={onSubmit}>
          <TextField label="Username" name="username" required />
          <TextField label="Email" type="email" name="email" required />
          <TextField
            label="Password"
            type={isOpen ? 'text' : 'password'}
            name="password"
            required
            adornmentRight={
              <InputRightElement>
                <IconButton
                  h="1.75rem"
                  size="sm"
                  onClick={onToggle}
                  icon={isOpen ? 'view-off' : 'view'}
                />
              </InputRightElement>
            }
          />
          <Box pt={3} pb={2}>
            <Button
              loadingText="Submitting"
              type="submit"
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
          to="/login"
          as={Link}
          fontSize="sm"
          d="block"
          mb={2}
        >
          Already have an account?
        </Button>
      </Box>
    </>
  );
};

export default Register;
