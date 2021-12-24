# use-derived-value

![npm-version](https://img.shields.io/npm/v/use-derived-value.svg)
[![codecov](https://codecov.io/gh/zhangyu1818/use-derived-value/branch/main/graph/badge.svg?token=XMOY7SVSJ4)](https://codecov.io/gh/zhangyu1818/use-derived-value)

Implement getDerivedStateFromProps with hook。

[![Edit dark-pond-osbps](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/dark-pond-osbps?fontsize=14&hidenavigation=1&theme=dark)

## Install

```shell
npm install use-derived-value
```

## Usage

```jsx
import React from 'react'
import useDerivedValue from 'use-derived-value'

const Input = props => {
    const defaultValue = props.defaultValue ?? props.value
    const [state, setState] = useDerivedValue(defaultValue, {
        postState: () => props.value ?? null,
        onChange: props.onChange,
    })

    return <input value={state} onChange={setState} />
}

function App() {
    const [value, setValue] = React.useState('initValue')
    return (
        <Input
            value={value}
            onChange={({ target }) => {
                setValue(target.value)
            }}
        />
    )
}
```

## API

```typescript
useDerivedValue<State>(initialState: State, options: Options<State>)

type Options<State> = {
    postState?: () => State | null
    onChange?: (value: State, prevValue: State) => void
}
```

`postState` is a function, return a new value, if return null mean that is not controlled, it will use `state` in `useDerivedValue`.

`onChange` will called when set new value, second parameter is the old value.
