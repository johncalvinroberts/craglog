import React from 'react';
import {
  Box,
  Heading,
  Icon,
  Button,
  useDisclosure,
  InputRightElement,
  IconButton,
} from '@chakra-ui/core';
import * as yup from 'yup';
import useFormal from '@kevinwolf/formal-web';
import useLayout from '../hooks/useLayout';
import useTitle from '../hooks/useTitle';
import { useDispatch } from './State';
import LoginLayout from './layouts/LogIn';
import TextField from './fields/TextField';
import { performRegistration } from '../states';

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

  const dispatch = useDispatch();

  const formal = useFormal(initialValues, {
    schema,
    onSubmit: async (formValues) => {
      try {
        await dispatch(performRegistration(formValues));
      } catch (error) {
        console.log({ error });
      }
    },
  });

  const { isOpen, onToggle } = useDisclosure();
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
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default Register;
