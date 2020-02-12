import React from 'react';
import { Box } from '@chakra-ui/core';
import { camelCaseToTitleCase } from '@/utils';
import Emoji from './Emoji';

const tickTypeEmojis = {
  lead: () => <Emoji label="chains" symbol="⛓" />,
  flash: () => <Emoji label="fire" symbol="🔥" />,
  onsight: () => <Emoji label="three fires" symbol="🔥🔥🔥" />,
  redpoint: () => <Emoji label="red dot" symbol="🔴" />,
  pinkpoint: () => <Emoji label="a peach" symbol="🍑" />,
  ropedog: () => <Emoji label="a dog" symbol="🐕" />,
  firstAscent: () => <Emoji label="a mountain" symbol="🏔️" />,
  firstFreeAscent: () => (
    <Emoji label="a mountain and a trophy" symbol="🏔️🏆" />
  ),
  allFreeWithRest: () => <Emoji label="a red dot not full" symbol="⭕" />,
  // toprope
  topRopeFreeAscent: () => <Emoji label="check mark" symbol="✔" />,
  topRopeWithRest: () => <Emoji label="part alteration mark" symbol="〽" />,
  // boulder
  send: () => <Emoji label="top symbol" symbol="🔝" />,
  dab: () => <Emoji label="plus symbol" symbol="➕" />,
  repeatSend: () => <Emoji label="repeat symbol" symbol="🔄" />,
  // failures
  retreat: () => <Emoji label="big red x" symbol="↪" />,
  attempt: () => <Emoji label="big red x" symbol="❌" />,
  utterFailure: () => <Emoji label="prohibited symbol" symbol="🚫" />,
};

function TickTypeChip({ type }) {
  const Emoj = tickTypeEmojis[type] || (() => <></>);
  return (
    <Box textTransform="uppercase" fontWeight="medium" px={1}>
      {camelCaseToTitleCase(type)}
      <Box as="span" ml={1}>
        <Emoj />
      </Box>
    </Box>
  );
}

export default TickTypeChip;
