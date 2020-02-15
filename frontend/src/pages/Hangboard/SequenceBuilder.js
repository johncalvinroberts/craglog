import React, { useState } from 'react';
import { Box, Icon, useColorMode } from '@chakra-ui/core';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PseudoButton from '@/components/PseudoButton';

const draggingBoxShadow = '1px 2px 4px 0px rgba(78, 78, 78, 0.28)';

const ItemDraggable = ({ item, index, isActive, ...props }) => {
  const { colorMode } = useColorMode();
  const bg = { light: 'white', dark: 'gray.800' };

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          boxShadow={snapshot.isDragging ? draggingBoxShadow : ''}
          borderBottomWidth="1px"
          bg={bg[colorMode]}
          style={provided.draggableProps.style}
          {...props}
        >
          <Box>{item.id}</Box>
        </Box>
      )}
    </Draggable>
  );
};

const SequenceBuilder = () => {
  const [activeIndex, setActiveIndex] = useState();

  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'sequence',
  });

  const handleAdd = (e) => {
    e.preventDefault();
    append({ name: 'sequence' });
  };

  const handleSelectItem = (index) => {
    setActiveIndex(index);
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    move(source.index, destination.index);
    if (source.index === activeIndex) {
      setActiveIndex(destination.index);
    }
  };

  return (
    <Box borderWidth="1px" d="flex">
      <Box borderRightWidth="1px" position="relative" flex="0 0 13rem">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                overflowY="scroll"
                maxHeight="600px"
              >
                {fields.map((item, index) => (
                  <ItemDraggable
                    key={item.id}
                    item={item}
                    index={index}
                    onClick={() => handleSelectItem(index)}
                    isActive={activeIndex === index}
                    handleRemove={() => handleRemove(index)}
                  />
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        <PseudoButton
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          d="flex"
          justifyContent="center"
          alignItems="center"
          height="3rem"
          width="13rem"
          _hover={{
            backgroundColor: 'teal.400',
          }}
          backgroundColor="teal.300"
          onClick={handleAdd}
        >
          <Icon name="add" />
        </PseudoButton>
      </Box>
      <Box flexGrow="1" height="600px">
        render item form items here
      </Box>
    </Box>
  );
};

export default SequenceBuilder;
