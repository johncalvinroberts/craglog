import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton, Heading, Text, useColorMode } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import Guu from 'guu';
import { useTitle } from '../../hooks';
import LoginLayout from '../../components/LogInLayout';
import {
  getMostSimilarGrade,
  stringToEntry,
  allGradesAsArray,
  systems,
} from './utils';

const log = new Guu('converter', 'pink');

const CELL_WIDTH = ['0 0 6.2rem'];

const outerRef = {
  current: undefined,
};

const handleKeydown = () => {
  outerRef.current?.focus();
};

const Grade = ({ value, isHighlight }) => {
  const entry = stringToEntry(value);
  const { grade, system, conversions = [] } = entry;
  return (
    <Box display="flex">
      {conversions.map((item) => {
        const isPrimary =
          isHighlight && item.grade === grade && item.system === system;
        const isSecondary = isHighlight && !isPrimary;
        return (
          <Box
            flex={CELL_WIDTH}
            display="flex"
            key={`${item.system}${item.grade}`}
            borderColor="gray.200"
            borderBottom="1px"
            borderRight="1px"
            {...(isPrimary ? { opacity: '1' } : null)}
            {...(isSecondary ? { opacity: '0.8' } : null)}
            {...(!isSecondary && !isPrimary ? { opacity: '0.5' } : null)}
          >
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
  const [matches, setMatches] = useState(allGradesAsArray);
  const inputRef = useRef();
  const { colorMode } = useColorMode();
  const headerBg = { light: 'gray.200', dark: 'gray.900' };

  useEffect(() => {
    outerRef.current = inputRef.current;
    inputRef.current.focus();
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const handleInput = (e) => {
    const query = e.target.value?.trim();
    const matches = query
      ? getMostSimilarGrade(e.target.value?.trim())
      : allGradesAsArray;
    log.info(matches);
    setMatches(matches);
  };

  return (
    <LoginLayout maxW="800px">
      <Box mb={4} d="block" minHeight="80vh">
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
          <Box
            d="flex"
            position="sticky"
            top="0"
            backgroundColor={headerBg[colorMode]}
            zIndex="9999"
            width="100%"
          >
            {systems.map(({ key, displayName, emoji }) => (
              <Box flex={CELL_WIDTH} key={key} d="flex" alignItems="center">
                <Box>{emoji}</Box>
                <Text mx={[0, 2]} fontSize="xs" flex="1" lineHeight="normal">
                  {displayName}
                </Text>
              </Box>
            ))}
          </Box>
          {matches.map((item, index) => (
            <Grade
              key={item.name}
              value={item.name}
              isHighlight={index === 0}
            />
          ))}
        </Box>
      </Box>
    </LoginLayout>
  );
};

export default ClimbingGradeConverter;
