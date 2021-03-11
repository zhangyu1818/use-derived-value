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
  const [state, setState] = useDerivedValue("value", () => {
    if ("value" in props) {
      return props.value;
    }
    return null;
  });

  const onInputChange = (event) => {
    if ("onChange" in props) {
      props.onChange(event);
    } else {
      setState(event.target.value);
    }
  };

  return <input value={state} onChange={onInputChange} />;
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

```javascript
const useDerivedValue = (initialState, getDerivedValue)
```

`getDerivedValue` is a function,return a new value to the state or null.
