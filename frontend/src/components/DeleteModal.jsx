import React from 'react';
import {
  Box,
  Button,
  SlideIn,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/core';

const DeleteModal = ({
  isOpen,
  deleteBtnRef,
  onClose,
  handleDelete,
  children,
  deleteText = 'Delete',
  cancelText = 'Cancel',
}) => {
  return (
    <SlideIn in={isOpen}>
      {(styles) => (
        <Modal finalFocusRef={deleteBtnRef} onClose={onClose} isOpen isCentered>
          <ModalOverlay opacity={styles.opacity} />
          <ModalContent pb={5} {...styles}>
            <ModalHeader>{children}</ModalHeader>
            <ModalCloseButton onClick={onClose} />
            <ModalBody>
              <Box pt={2} d="flex">
                <Button
                  aria-label="confirm delete"
                  variant="solid"
                  variantColor="red"
                  size="sm"
                  onClick={handleDelete}
                  mr={2}
                >
                  {deleteText}
                </Button>
                <Button
                  aria-label="confirm delete"
                  variant="solid"
                  size="sm"
                  onClick={onClose}
                >
                  {cancelText}
                </Button>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </SlideIn>
  );
};

export default DeleteModal;
