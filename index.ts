import * as React from "react";

export type GetDerivedValue<State> = () => State | null;

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

const useDerivedValue = <T>(
  initialState: T,
  derivedValue: GetDerivedValue<T>
): [T, SetState<T>] => {
  const rerender = React.useState({})[1];

  const stateRef = React.useRef(initialState);

  const derivedState = derivedValue();

  if (derivedState !== null && derivedState !== stateRef.current) {
    stateRef.current = derivedState;
  }

  const setState = React.useRef<SetState<T>>((value) => {
    let newState: T;
    if (typeof value === "function") {
      newState = (value as (prevState: T) => T)(stateRef.current);
    } else {
      newState = value;
    }
    stateRef.current = newState;
    rerender({});
  });

  return [stateRef.current, setState.current];
};

export default useDerivedValue;
