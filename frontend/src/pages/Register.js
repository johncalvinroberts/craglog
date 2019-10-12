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
import useFormal from '@kevinwolf/formal-web';
import { useHistory, Link } from 'react-router-dom';
import useLayout from '@/hooks/useLayout';
import useTitle from '@/hooks/useTitle';
import { useDispatch } from '@/components/State';
import LoginLayout from '@/layouts/LogIn';
import TextField from '@/fields/TextField';
import { performRegistration, performLogin } from '@/states';
import useAuthState from '@/hooks/useAuthState';

const schema = yup.object().shape({
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

const initialValues = {
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

  const formal = useFormal(initialValues, {
    schema,
    onSubmit: async (formValues) => {
      try {
        await dispatch(performRegistration(formValues));
        await dispatch(
          performLogin({
            username: formValues.username,
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
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      toast({
        description: 'You are already logged in to craglog',
        duration: 4000,
        isClosable: true,
      });
      history.replace('/app');
    }
  }, []);

  return (
    <>
      <Box mb={4} d="block">
        <Icon name="logo" size="60px" />
        <Heading>Join craglog</Heading>
      </Box>
      <Box w="100%" borderWidth="1px" rounded="sm" overflow="hidden" p="4">
        <form {...formal.getFormProps()}>
          <TextField
            label="Username"
            id="username"
            formal={formal.getFieldProps('username')}
            required
          />
          <TextField
            label="Email"
            id="email"
            type="email"
            formal={formal.getFieldProps('email')}
            required
          />
          <TextField
            label="Password"
            id="password"
            type={isOpen ? 'text' : 'password'}
            formal={formal.getFieldProps('password')}
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
              {...formal.getSubmitButtonProps()}
              isLoading={formal.isSubmitting}
              loadingText="Submitting"
              border="2px"
              borderColor="teal.300"
              variant="solid"
            >
              Submit
            </Button>
          </Box>
        </form>
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
