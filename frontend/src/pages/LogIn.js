import React from 'react';
import { Box, Heading, Icon } from '@chakra-ui/core';
import * as yup from 'yup';
import useLayout from '@/hooks/useLayout';
import LoginLayout from '@/layouts/LogIn';

const schema = yup.object().shape({
  username: yup.string().required(),
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required(),
});

const initialValues = {
  username: '',
  email: '',
  password: '',
};

const LogIn = () => {
  useLayout(LoginLayout);
  return (
    <>
      <Box mb={8} d="block">
        <Icon name="logo" size="60px" />
        <Heading>Log in to craglog</Heading>
      </Box>
      <Box maxW="md" borderWidth="1px" rounded="sm" overflow="hidden" p="4">
        login
      </Box>
    </>
  );
};

export default LogIn;
