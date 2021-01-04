import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import DashboardWrapper from '../components/DashboardWrapper';
import { useTitle, useAuthState } from '../hooks';
import DeleteModal from '../components/DeleteModal';
import http from '../http';
import { useDispatch } from '../components/State';
import { performLogout } from '../states';

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
      toast({
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 9000,
      });
    }
  };

  return (
    <DashboardWrapper>
      <Box>
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
