import React, { useRef, useState, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  useToast,
  Spinner,
  IconButton,
  useDisclosure,
} from '@chakra-ui/core';
import { useSWRInfinite } from 'swr';
import { Link as RouterLink } from 'react-router-dom';
import EmptyView from '../../components/EmptyView';
import SequenceCard from '../../components/SequenceCard';
import { QuietLink } from '../../components/Link';
import DeleteModal from '../../components/DeleteModal';
import http from '../../http';
import { useTitle, useHover } from '../../hooks';
import { getErrorMessage } from '../../utils';

const SequenceListCard = ({ sequence }) => {
  const [hovered, bindHover] = useHover();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const toast = useToast();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const deleteBtnRef = useRef();
  const handleDelete = useCallback(async () => {
    onClose();
    setIsDeleting(true);
    try {
      await http.delete(`/hangboard-sequence/${sequence.id}`);
      setIsDeleted(true);
    } catch (error) {
      toast({
        description: getErrorMessage(error),
        status: 'error',
        isClosable: true,
      });
    }
    setIsDeleting(false);
  }, [onClose, sequence.id, toast]);

  return (
    <>
      <SequenceCard
        sequence={sequence}
        {...(isDeleted ? { d: 'none' } : null)}
        {...(isDeleting
          ? {
              opacity: 0.6,
              pointerEvents: 'none',
            }
          : null)}
        {...bindHover}
      >
        <Box
          opacity={['1', '1', hovered ? '1' : '0']}
          transition="opacity 0.2s ease"
          flex="1"
          d="flex"
          justifyContent="flex-end"
        >
          <IconButton
            icon="delete"
            variant="ghost"
            color="gray.500"
            onClick={onToggle}
          />
          <IconButton
            icon="edit"
            variant="ghost"
            color="gray.500"
            as={RouterLink}
            to={`/app/hangboard/sequence/${sequence.id}/edit`}
          />
        </Box>
      </SequenceCard>
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        deleteBtnRef={deleteBtnRef}
        handleDelete={handleDelete}
      >
        Delete this sequence?
      </DeleteModal>
    </>
  );
};

const SequenceList = () => {
  const toast = useToast();
  useTitle('Hangboard');

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end
    const offSet = pageIndex + 1 * 10 - 10;
    return `/hangboard-sequence?take=10&skip=${offSet}`;
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    http.get,
  );

  if (error) {
    toast({
      status: 'error',
      description: getErrorMessage(error),
      isClosable: true,
    });
  }

  const pages = data && data.reduce((memo, item) => [...memo, ...item], []);

  return (
    <Box d="block" mb={[4, 8]}>
      <Box
        d="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={[2, 4]}
      >
        <Box width="100%">
          <Box
            d="flex"
            justifyContent="space-between"
            mb={1}
            alignItems="center"
            width="100%"
          >
            <Heading size="md">Sequences</Heading>
            <QuietLink
              to="/app/hangboard/sequence/new"
              width="auto"
              height="auto"
            >
              New
            </QuietLink>
          </Box>
          <Text size="xs" as="div" width="auto" height="auto" mb={2}>
            Choose a sequence to start the workout.
          </Text>
        </Box>
      </Box>
      <Box>
        {pages &&
          pages.map((item) => {
            return <SequenceListCard key={item.id} sequence={item} />;
          })}
      </Box>
      {isValidating && (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="50px"
        >
          <Spinner size="md" />
        </Box>
      )}
      {!isValidating && !data && <EmptyView message="Nothing more to show." />}
      {!isValidating && size && (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100px"
        >
          <Button onClick={() => setSize(size + 1)} disabled={isValidating}>
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SequenceList;
