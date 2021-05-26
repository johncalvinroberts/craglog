import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton, Heading, Text } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import Guu from 'guu';
import { useTitle } from '../../hooks';
import LoginLayout from '../../components/LogInLayout';
import { getMostSimilarGrade, stringToEntry } from './utils';

const log = new Guu('converter', 'pink');

const outerRef = {
  current: undefined,
};

const handleKeydown = () => {
  outerRef.current?.focus();
};

const Grade = ({ value }) => {
  const entry = stringToEntry(value);
  const { grade, system, conversions = [] } = entry;
  return (
    <Box display="flex">
      {conversions.map((item) => {
        return (
          <Box
            flex="0 0 40px"
            display="flex"
            key={`${item.system}${item.grade}`}
            {...(item.grade === grade && item.system === system
              ? { border: 'solid 2px black' }
              : null)}
          >
            <Text mr={1} fontSize={['xs', 'sm']} fontWeight="medium">
              {item.system}
            </Text>
            <Text mx={[0, 2]} fontSize="xs" flex="1" lineHeight="normal">
              {item.grade}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};

const ClimbingGradeConverter = () => {
  useTitle('Climbing Grade Converter');
  const [matches, setMatches] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    outerRef.current = inputRef.current;
    inputRef.current.focus();
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const handleInput = (e) => {
    const matches = getMostSimilarGrade(e.target.value?.trim());
    log.info(matches);
    setMatches(matches);
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
            maxWidth="200px"
            backgroundColor="transparent"
            borderRadius="0"
            outline="none"
          />
        </Box>
        <Box>
          {matches.map((item) => (
            <Grade key={item.name} value={item.name} />
          ))}
        </Box>
      </Box>
    </LoginLayout>
  );
};

export default ClimbingGradeConverter;
