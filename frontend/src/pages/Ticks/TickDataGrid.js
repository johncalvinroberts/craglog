import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import {
  useToast,
  Box,
  Spinner,
  Button,
  Text,
  useColorMode,
  Icon,
  useDisclosure,
  Collapse,
  IconButton,
} from '@chakra-ui/core';
import useSWR, { useSWRInfinite, mutate } from 'swr';
import format from 'date-fns/format';
import differenceInDays from 'date-fns/differenceInDays';
import isSameDay from 'date-fns/isSameDay';
import isSameYear from 'date-fns/isSameYear';
import http from '@/http';
import getErrorMessage from '@/utils/getErrorMessage';
import EmptyView from '@/components/EmptyView';
import RouteCard from '@/components/RouteCard';
import TickStyleChip from '@/components/TickStyleChip';
import TickTypeChip from '@/components/TickTypeChip';
import DeleteModal from '@/components/DeleteModal';
import { DATE_FORMAT } from '@/constants';

const DatesContext = createContext();

const reducer = (state, action) => ({ ...state, ...action });

const yearCardBg = { light: 'white', dark: 'gray.800' };
const detailBg = {
  light: 'gray.50',
  dark: 'gray.600',
};

const TickCard = ({ item, dictKey }) => {
  const { colorMode } = useColorMode();
  const { isOpen, onToggle } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onToggle: onToggleDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const toast = useToast();

  const datesDict = useContext(DatesContext);
  const allKeys = Object.keys(datesDict);
  const currentIndex = allKeys.indexOf(dictKey);

  const deleteBtnRef = useRef();

  if (currentIndex === -1) {
    return <></>;
  }

  const prevDateString = datesDict[allKeys[currentIndex - 1]];
  const prevDate = prevDateString && new Date(prevDateString);
  const currentDate = new Date(item.tickDate);
  const daysFromPrevDate = prevDate && differenceInDays(prevDate, currentDate);
  const isSameDayAsPrevDate = prevDate && isSameDay(prevDate, currentDate);
  const isBigTimeGap = daysFromPrevDate > 100;

  let mt = `${daysFromPrevDate + 4}px`;
  if (isBigTimeGap) mt = `200px`;
  if (isSameDayAsPrevDate) mt = 0;

  const isFirstOfYear = !prevDate ? true : !isSameYear(prevDate, currentDate);

  const handleDelete = async () => {
    onCloseDeleteModal();
    try {
      setIsDeleting(true);
      await http.delete(`/tick/${item.id}`);
      setIsDeleted(true);
    } catch (error) {
      toast({
        description: getErrorMessage(error),
        status: 'error',
        isClosable: true,
      });
    }
    setIsDeleting(false);
  };

  if (isDeleted) return <></>;

  return (
    <>
      {isFirstOfYear && (
        <>
          <Box
            width="1px"
            borderRightWidth="1px"
            height={mt}
            mb={`-${mt}`}
            ml="3rem"
          />
          <Box flex="0 0 100%" position="sticky" top="4rem">
            <Text
              fontSize="2xl"
              verticalAlign="baseline"
              fontWeight="semibold"
              width="6rem"
              bg={yearCardBg[colorMode]}
              textAlign="center"
              borderWidth="1px"
              pb={1}
              mt={mt}
            >
              {format(currentDate, 'yyyy')}
            </Text>
          </Box>
          <Box
            width="1px"
            borderRightWidth="1px"
            height={2}
            mt={-1}
            ml="3rem"
          />
        </>
      )}
      <Box>
        {!isFirstOfYear && !isSameDayAsPrevDate && (
          <Box
            width="1px"
            borderRightWidth="1px"
            height={mt}
            mb={`-${mt}`}
            ml="3rem"
          />
        )}
        <Box
          d="flex"
          justifyContent="space-between"
          mt={isFirstOfYear ? 0 : mt}
          flexWrap="wrap"
        >
          <Box
            flex="0 0 6rem"
            height="6rem"
            d="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            {...(!isSameDayAsPrevDate
              ? { borderWidth: '1px', borderRightWidth: '0' }
              : null)}
          >
            {!isSameDayAsPrevDate && (
              <Text
                fontSize="2xl"
                verticalAlign="baseline"
                fontWeight="semibold"
              >
                {format(currentDate, 'MM/dd')}
              </Text>
            )}
            {isSameDayAsPrevDate && (
              <Box width="1px" borderRightWidth="1px" height="100%" />
            )}
          </Box>
          <Box
            flex="1"
            d="flex"
            justifyContent="space-between"
            flexDirection="column"
            flexWrap="wrap"
            borderWidth="1px"
            borderTopWidth={isSameDayAsPrevDate ? 0 : '1px'}
            position="relative"
            {...(isDeleting
              ? {
                  opacity: 0.6,
                  pointerEvents: 'none',
                }
              : null)}
          >
            {isDeleting && (
              <Box
                zIndex="99"
                d="flex"
                justifyContent="center"
                alignItems="center"
                position="absolute"
                left="0"
                top="0"
                right="0"
                bottom="0"
                width="100%"
              >
                <Spinner size="sm" />
              </Box>
            )}
            <Box display="flex" justifyContent="flex-start" p={2}>
              <TickStyleChip style={item.style} />
              <TickTypeChip type={item.type} />
            </Box>
            {item.route && (
              <RouteCard
                route={item.route}
                showLink={false}
                showStyle={false}
                wrapperStyleProps={{
                  py: 0,
                  pl: 2,
                  borderBottom: 'none',
                  flex: 1,
                }}
                innerStyleProps={{
                  justifyContent: 'flex-start',
                }}
              />
            )}
            {item.gymName && (
              <Text
                mr={1}
                fontSize={['xs', 'sm']}
                fontWeight="medium"
                pl={2}
                flex={1}
              >
                @{item.gymName}
              </Text>
            )}
            <Collapse isOpen={isOpen} animateOpacity>
              <Box p={2} minHeight="8rem" backgroundColor={detailBg[colorMode]}>
                <Box>
                  <Box d="flex" justifyContent="flex-start">
                    <Text
                      fontSize="xs"
                      width="unset"
                      height="unset"
                      fontWeight="medium"
                    >
                      Timestamp:
                    </Text>
                    <Text fontSize="xs" width="unset" height="unset" ml={1}>
                      {format(currentDate, DATE_FORMAT)}
                    </Text>
                  </Box>
                  <Box d="flex" justifyContent="flex-start">
                    <Text
                      fontSize="xs"
                      width="unset"
                      height="unset"
                      fontWeight="medium"
                    >
                      Physical Rating:
                    </Text>
                    <Text fontSize="xs" width="unset" height="unset" ml={1}>
                      {item.physicalRating || <em>None set</em>}
                    </Text>
                  </Box>
                  <Text
                    fontSize="xs"
                    width="unset"
                    height="unset"
                    fontWeight="medium"
                  >
                    Notes:
                  </Text>
                </Box>
                <Box>
                  {item.notes || (
                    <EmptyView message="No notes were written :\" />
                  )}
                </Box>
                <Box d="flex" justifyContent="flex-start" py={2}>
                  <IconButton
                    aria-label="Delete log"
                    icon="delete"
                    backgroundColor="none"
                    ref={deleteBtnRef}
                    onClick={onToggleDeleteModal}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Edit log"
                    icon="edit"
                    as={Link}
                    to={{ pathname: `/app/tick/${item.id}/edit`, item }}
                    backgroundColor="none"
                  />
                </Box>
              </Box>
            </Collapse>
            <DeleteModal
              deleteBtnRef={deleteBtnRef}
              onClose={onCloseDeleteModal}
              handleDelete={handleDelete}
              isOpen={isDeleteModalOpen}
            >
              Delete this log?
            </DeleteModal>
            <Button
              flex="1"
              d="flex"
              justifyContent="center"
              outline="none"
              aria-label="Show more"
              borderRadius="0"
              maxWidth="unset"
              width="100%"
              variant="ghost"
              maxHeight="18px"
              onClick={onToggle}
            >
              <Icon
                name="chevron-down"
                transition="transform 0.2s ease-in-out"
                css={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: `transform 0.2s ease-in-out`,
                }}
              />
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

const TickDataGrid = ({ query }) => {
  const toast = useToast();
  const [datesDict, dispatch] = useReducer(reducer, {});

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end
    const offSet = pageIndex + 1 * 10;
    return `/tick?take=10&skip=${offSet}&${query}`;
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

  if (!data) {
    return (
      <Box
        d="flex"
        alignItems="center"
        p={4}
        justifyContent="center"
        width="100%"
      >
        <Spinner />
      </Box>
    );
  }

  const nextDatesDict = data.reduce((memo, current, index) => {
    const key = `${size || 0}_${index}`;
    return { ...memo, [key]: current.tickDate };
  }, {});

  dispatch(nextDatesDict);
  // return nothing, not needed
  const pages = data.map((item) => {
    return <TickCard item={item} key={item.id} dictKey={nextDatesDict} />;
  });

  return (
    <DatesContext.Provider value={datesDict}>
      <Box position="relative">{pages}</Box>
      {isValidating && (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="50px"
        >
          loading....
        </Box>
      )}
      {!data && (
        <EmptyView message="No more logs to show">
          <Button
            as={Link}
            to="/app/tick/new"
            backgroundColor="teal.300"
            variant="solid"
            color="white"
            _hover={{
              backgroundColor: 'teal.200',
            }}
          >
            Log a new climb now
          </Button>
        </EmptyView>
      )}
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
    </DatesContext.Provider>
  );
};

export default TickDataGrid;
