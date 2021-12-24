import * as React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'

import useDerivedValue from './index'

describe('hook test', () => {
    it('should work like useState', () => {
        const fn = jest.fn()
        const t = () => {
            const [value, setValue] = useDerivedValue(0)
            fn.mockImplementation(value => setValue(value))
            return { value, setValue: fn }
        }

        const { result } = renderHook(() => t())

        act(() => {
            result.current.setValue(1)
        })

        expect(result.current.value).toBe(1)
        expect(fn).toBeCalledWith(1)
    })

    it('should controlled value', () => {
        const t = propsValue => {
            const [value, setValue] = useDerivedValue(propsValue, {
                postState: () => propsValue,
            })
            return { value, setValue }
        }

        const { result, rerender } = renderHook(value => t(value), { initialProps: 0 })

        act(() => {
            result.current.setValue(1)
        })

        expect(result.current.value).toBe(0)

        rerender(1)

        expect(result.current.value).toBe(1)
    })

    it('should call onChange', () => {
        const fn = jest.fn()
        const t = () => {
            const [value, setValue] = useDerivedValue(0, {
                onChange: fn,
            })
            return { value, setValue }
        }

        const { result } = renderHook(() => t())

        act(() => {
            result.current.setValue(1)
        })

        expect(fn).toBeCalledWith(1, 0)
    })

    it('should call correct onChange when fn changed', () => {
        const fn = jest.fn()
        const fn1 = jest.fn()

        const t = fn => {
            const [value, setValue] = useDerivedValue(0, {
                onChange: fn,
            })
            return { value, setValue }
        }

        const { result, rerender } = renderHook(fn => t(fn), { initialProps: fn })

        act(() => {
            result.current.setValue(1)
        })

        expect(fn).toBeCalledWith(1, 0)

        rerender(fn1)

        act(() => {
            result.current.setValue(2)
        })

        expect(fn1).toBeCalledWith(2, 1)
    })

    it('should be controlled', () => {
        const fn = jest.fn()

        const t = () => {
            const [propsValue, setPropsValue] = React.useState(0)
            const [value, setValue] = useDerivedValue(propsValue, {
                postState: () => propsValue,
                onChange: newValue => fn(newValue),
            })

            fn.mockImplementation(value => setPropsValue(value))

            return { value, propsValue, setValue }
        }
        const { result } = renderHook(() => t())

        act(() => {
            result.current.setValue(1)
        })

        expect(result.current.value).toBe(1)
        expect(result.current.propsValue).toBe(1)
        expect(fn).toBeCalledWith(1)
    })

    it('should be like getDerivedStateFromProps and no extra rerender', () => {
        let renderTime = 0

        const t = () => {
            const [propsValue, setPropsValue] = React.useState(0)
            const [value, setValue] = useDerivedValue(propsValue, {
                postState: () => propsValue,
                onChange: newValue => setPropsValue(newValue),
            })

            renderTime++

            return { value, setValue }
        }

        const { result } = renderHook(() => t())

        expect(renderTime).toBe(1)

        act(() => {
            result.current.setValue(1)
        })

        expect(renderTime).toBe(2)
    })
})
