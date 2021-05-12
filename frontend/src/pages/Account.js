import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Guu from 'guu';
import Form, { PasswordField } from '../components/Form';
import DashboardWrapper from '../components/DashboardWrapper';
import { useTitle, useAuthState } from '../hooks';
import DeleteModal from '../components/DeleteModal';
import http from '../http';
import { useDispatch } from '../components/State';
import { performLogout } from '../states';

const log = new Guu('Account', 'purple');

const validationSchema = yup.object().shape({
  newPassword: yup.string().required().min(8).max(250),
  oldPassword: yup.string().required().min(8).max(250),
});

const defaultValues = {
  newPassword: '',
  oldPassword: '',
};

const ChangePasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const formMethods = useForm({ validationSchema, defaultValues });
  const { watch, reset } = formMethods;
  const { newPassword, oldPassword } = watch();
  const toast = useToast();
  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await http.post(`/user/change-password`, values);
      toast({
        duration: 5000,
        description: 'Password updated successfully',
        isClosable: true,
      });
      reset();
    } catch (error) {
      toast({
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 9000,
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <Heading size="md" mb={4}>
        Change Password
      </Heading>
      <Form
        onSubmit={onSubmit}
        methods={formMethods}
        defaultValues={defaultValues}
      >
        <Box d={['block', 'block', 'flex']} justifyContent="space-between">
          <PasswordField name="newPassword" label="New Password" required />
          <PasswordField name="oldPassword" label="Old Password" required />
        </Box>
        <Button
          variantColor="red"
          disabled={!newPassword || !oldPassword}
          loadingText="Changing..."
          isLoading={isLoading}
          type="submit"
        >
          Change password
        </Button>
      </Form>
    </>
  );
};

const Account = () => {
  useTitle('Account');

  const { isOpen, onToggle, onClose } = useDisclosure();
  const { user } = useAuthState();
  const toast = useToast();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleDelete = async () => {
    try {
      await http.delete(`/user/${user.id}`);
      dispatch(performLogout());
      history.replace('/login');
      toast({
        duration: 5000,
        description: 'You have logged out',
        isClosable: true,
      });
    } catch (error) {
      log.error('Failed to delete user', error);
      toast({
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 9000,
      });
    }
  };

  return (
    <DashboardWrapper>
      <Box pb={8}>
        <Heading size="md" mb={4}>
          Destroy Account
        </Heading>
        <Text size="xs" mb={4} as="div" width="auto" height="auto">
          Account deletion is permanent. Once you destroy your account, the data
          is gone forever.
        </Text>
        <Button variantColor="red" onClick={onToggle}>
          Destroy Account
        </Button>
      </Box>

      <Box>
        <ChangePasswordForm />
      </Box>
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        deleteText="Yes I am sure"
        cancelText="No! Do not delete my account"
        handleDelete={handleDelete}
      >
        Are you sure you want to destroy your account?
      </DeleteModal>
    </DashboardWrapper>
  );
};

export default Account;
