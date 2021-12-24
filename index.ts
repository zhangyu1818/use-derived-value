import * as React from 'react'

type Options<State> = {
    postState?: () => State | null
    onChange?: (value: State, prevValue: State) => void
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

const noop = () => null

const useDerivedValue = <State>(initialState: State, options: Options<State> = {}) => {
    const { postState = noop, onChange } = options

    const rerender = React.useReducer(v => v + 1, 0)[1]

    const stateRef = React.useRef(initialState)

    const onChangeRef = React.useRef(onChange)
    onChangeRef.current = onChange

    const derivedState = postState()

    if (derivedState !== null && derivedState !== stateRef.current) {
        stateRef.current = derivedState
    }

    const setState = React.useRef<SetState<State>>(value => {
        let newState: State
        if (typeof value === 'function') {
            newState = (value as (prevState: State) => State)(stateRef.current)
        } else {
            newState = value
        }
        onChangeRef.current?.(newState, stateRef.current)
        stateRef.current = newState
        rerender()
    })

    return [stateRef.current, setState.current] as const
}

export default useDerivedValue
