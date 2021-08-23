# use-derived-value

Implement getDerivedStateFromProps with hook。

## Install

```shell
yarn add use-derived-value
```

## Usage

```jsx
import React from "react";
import useDerivedValue from "use-derived-value";

const Input = (props) => {
    const defaultValue = props.defaultValue ?? props.value;
    const [state, setState] = useDerivedState(defaultValue, {
        postState: () => props.value ?? null,
        onChange: props.onChange
    });

  return <input value={state} onChange={setState} />;
};

function App() {
  const [value, setValue] = React.useState("initValue");
  return (
    <Input
      value={value}
      onChange={({ target }) => {
        setValue(target.value);
      }}
    />
  );
}
```

## API

```typescript
const useDerivedValue = (initialState, Options)

type Options<State> = {
    postState?: () => State | null;
    onChange?: (value: State, prevValue: State) => void;
};
```

`postState` is a function,return a new value to the state or null.

`onChange` will called when set new value.
