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
import useSWR, { useSWRPages, mutate } from 'swr';
import { Link as RouterLink } from 'react-router-dom';
import http from '@/http';
import EmptyView from '@/components/EmptyView';
import SequenceCard from '@/components/SequenceCard';
import { QuietLink } from '@/components/Link';
import DeleteModal from '@/components/DeleteModal';
import { useTitle, useHover } from '@/hooks';
import { getErrorMessage } from '@/utils';

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

  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    // page key
    'admin-jobs',
    /* eslint-disable react-hooks/rules-of-hooks */
    // page component
    ({ offset, withSWR }) => {
      const { data, error } = withSWR(
        // use the wrapper to wrap the *pagination API SWR*
        useSWR(`/hangboard-sequence?skip=${offset || 0}&take=25&`, http.get),
      );
      if (error)
        toast({
          description: error.message,
          status: 'error',
          isClosable: true,
        });
      /* eslint-enable react-hooks/rules-of-hooks */
      // you can still use other SWRs outside
      if (!data) {
        return (
          <Box
            d="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
          >
            <Spinner size="xl" />
          </Box>
        );
      }
      return data.map((item) => {
        mutate(`/hangboard-sequence/${item.id}`, item, false);
        return <SequenceListCard key={item.id} sequence={item} />;
      });
    },

    // get next page's offset from the index of current page
    (SWR, index) => {
      // there's no next page
      if (SWR.data && SWR.data.length === 0) return null;

      // offset = pageCount × pageSize
      return (index + 1) * 25;
    },

    // deps of the page component
    [],
  );

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
      <Box>{pages}</Box>
      {isLoadingMore && (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="50px"
        >
          <Spinner size="md" />
        </Box>
      )}
      {isReachingEnd && <EmptyView message="Nothing more to show." />}
      {!isLoadingMore && (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100px"
        >
          <Button onClick={loadMore} disabled={isReachingEnd || isLoadingMore}>
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SequenceList;
