import React, { useEffect } from 'react';
import {
  Box,
  Heading,
  Icon,
  Button,
  InputRightElement,
  IconButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import * as yup from 'yup';
import useFormal from '@kevinwolf/formal-web';
import { useHistory, Link } from 'react-router-dom';
import useLayout from '@/hooks/useLayout';
import useAuthState from '@/hooks/useAuthState';
import useTitle from '@/hooks/useTitle';
import LoginLayout from '@/layouts/LogIn';
import TextField from '@/fields/TextField';
import { performLogin } from '@/states';
import { useDispatch } from '@/components/State';

const schema = yup.object().shape({
  username: yup
    .string()
    .required()
    .min(6)
    .max(250),
  password: yup
    .string()
    .required()
    .min(8)
    .max(20),
});

const initialValues = {
  username: '',
  password: '',
};

const LogIn = () => {
  useLayout(LoginLayout);
  useTitle('Login');
  const { isOpen, onToggle } = useDisclosure();
  const history = useHistory();
  const toast = useToast();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuthState();

  const formal = useFormal(initialValues, {
    schema,
    onSubmit: async (formValues) => {
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
        <Heading>Log in to craglog</Heading>
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
          to="/register"
          as={Link}
          fontSize="sm"
          d="block"
          mb={2}
        >
          Not registered yet? Sign up here.
        </Button>
        <Button onClick={() => alert('todo')} variant="link" fontSize="sm">
          Forgot your password?
        </Button>
      </Box>
    </>
  );
};

export default LogIn;
