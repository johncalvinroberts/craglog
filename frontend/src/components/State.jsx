import React, {
  createContext,
  useState,
  useRef,
  useCallback,
  useContext,
  memo,
} from 'react';

/**
 * Root reducer
 */

const reducers = {};
let reducersIterator = Object.entries(reducers);

function rootReducer(state, action) {
  let hasChanged = false;
  const nextState = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, reducer] of reducersIterator) {
    const previousStateForKey = state[key];
    const nextStateForKey = reducer(previousStateForKey, action);
    nextState[key] = nextStateForKey;
    hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
  }
  if (process.env.NODE_ENV !== 'production') {
    window.__state = nextState;
  }
  return hasChanged ? nextState : state;
}

export function addReducer(key, initialState, reducer) {
  reducers[key] = (state = initialState, action) => {
    if (!Object.prototype.hasOwnProperty.call(action, key)) return state;
    return reducer(state, action[key]);
  };
  reducersIterator = Object.entries(reducers);
}

/**
 * Context provider and consumption hooks
 */

const StateContext = createContext();
const DispatchContext = createContext();

StateContext.displayName = 'StateContext';
DispatchContext.displayName = 'DispatchContext';

export default function State({ children }) {
  const [state, setState] = useState({});
  const stateRef = useRef(state);

  const getState = useCallback(() => stateRef.current, []);

  const dispatch = useCallback(
    (action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }
      const nextState = rootReducer(stateRef.current, action);
      stateRef.current = nextState;
      setState(nextState);
    },
    [getState],
  );

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export const useGlobalState = () => useContext(StateContext);
export const useDispatch = () => useContext(DispatchContext);

/**
 * Consumption component with memoization
 */

export function connect(mapStateToProps, Component) {
  const MemoizedComponent = memo(Component);

  function Connected(props) {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const finalProps = {
      ...props,
      ...mapStateToProps(state, props),
      dispatch,
    };

    return <MemoizedComponent {...finalProps} />;
  }

  if (Component.name) Connected.displayName = `Connected${Component.name}`;

  return Connected;
}
