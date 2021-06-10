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
  allGradesLength,
} from './utils';

const allGrades = allGradesAsArray.slice(0, allGradesLength);

const log = new Guu('converter', 'pink');

const CELL_WIDTH = ['1'];

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
        return (
          <Box
            flex={CELL_WIDTH}
            display="flex"
            key={`${item.system}${item.grade}`}
            borderColor="gray.200"
            borderBottom="1px"
            borderRight="1px"
            {...(isPrimary && isHighlight
              ? { opacity: '1', backgroundColor: 'hotpink' }
              : { opacity: '0.6' })}
            {...(!isHighlight ? { opacity: '0.9' } : null)}
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
  const [matches, setMatches] = useState(allGrades);
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
    const matches = query ? getMostSimilarGrade(query) : allGrades;
    log.info(matches);
    setMatches(matches);
  };

  const isHighlight =
    matches.length !== allGradesAsArray.length / systems.length;

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
            borderRight="1px solid"
            borderColor={headerBg[colorMode]}
          >
            {systems.map(({ key, displayName, emoji }) => (
              <Box
                flex={CELL_WIDTH}
                key={key}
                d="flex"
                alignItems="center"
                flexWrap="wrap"
                justifyContent="center"
                textAlign={['center', 'center', 'left']}
              >
                <Box>{emoji}</Box>
                <Text
                  mx={[0, 2]}
                  fontSize="xs"
                  flex={['0 0 100%', '0 0 100%', '1']}
                  lineHeight="normal"
                >
                  {displayName}
                </Text>
              </Box>
            ))}
          </Box>
          {matches.map((item) => (
            <Grade
              key={item.name}
              value={item.name}
              isHighlight={isHighlight}
            />
          ))}
        </Box>
      </Box>
    </LoginLayout>
  );
};

export default ClimbingGradeConverter;
