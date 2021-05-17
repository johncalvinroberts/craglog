import React, { useRef, useEffect } from 'react';
import { Box, IconButton, Heading } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import Guu from 'guu';
import { useTitle } from '../../hooks';
import LoginLayout from '../../components/LogInLayout';
import { getMostSimilarGrade } from './utils';

const log = new Guu('converter', 'pink');

const ClimbingGradeConverter = () => {
  useTitle('Climbing Grade Converter');
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleInput = (e) => {
    const matches = getMostSimilarGrade(e.target.value);
    log.info(matches);
  };

  return (
    <LoginLayout>
      <Box mb={4} d="block">
        <Box
          as={Link}
          style={{ display: 'block' }}
          to="/"
          aria-label="Craglog, back to landing page"
          mr={2}
        >
          <IconButton
            variant="ghost"
            color="current"
            fontSize="40px"
            rounded="full"
            icon="logo"
          />
        </Box>
        <Heading size="md">Climbing Grade Converter</Heading>
        <Box>
          <Box
            id="grade-input"
            as="input"
            type="text"
            onChange={handleInput}
            ref={inputRef}
            fontSize="113px"
            border="none"
          />
        </Box>
      </Box>
    </LoginLayout>
  );
};

export default ClimbingGradeConverter;
