import * as React from 'react';

type Options<State> = {
  postState?: () => State | null;
  onChange?: (value: State, prevValue: State) => void;
};

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

const useDerivedValue = <T>(initialState: T, options: Options<T> = {}): [T, SetState<T>] => {
  const { postState = () => null, onChange } = options;

  const rerender = React.useState({})[1];

  const stateRef = React.useRef(initialState);

  const derivedState = postState();

  if (derivedState !== null && derivedState !== stateRef.current) {
    stateRef.current = derivedState;
  }

  const setState = React.useRef<SetState<T>>((value) => {
    let newState: T;
    if (typeof value === 'function') {
      newState = (value as (prevState: T) => T)(stateRef.current);
    } else {
      newState = value;
    }
    onChange?.(newState, stateRef.current);
    stateRef.current = newState;
    rerender({});
  });

  return [stateRef.current, setState.current];
};

export default useDerivedValue;
