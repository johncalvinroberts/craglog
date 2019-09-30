import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';

function combineReducers(reducers) {
  const keys = Object.keys(reducers);

  return function combinedReducer(state, action) {
    let hasChanged = false;
    const nextState = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

let rootReducer = (state, payload) => ({ ...state, ...payload });

const reducers = {};

const StateContext = createContext();
const DispatchContext = createContext();

StateContext.displayName = 'StateContext';
DispatchContext.displayName = 'DispatchContext';

export function addReducer(key, initialState, reducer) {
  reducers[key] = (state = initialState, action) => {
    if (!Object.prototype.hasOwnProperty.call(action, key)) return state;
    return reducer(state, action[key]);
  };
  rootReducer = combineReducers(reducers);
}

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
    [rootReducer, getState], //eslint-disable-line
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
