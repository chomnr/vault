import React, { forwardRef } from 'react';

interface InputProps {
    id?: string
    type: string
    name?: string
    placeholder?: string
    required?: boolean
    value?: string | number
    onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    min?: number
    max?: number
    oninput?: (e: React.FormEvent<HTMLInputElement>) => void
    accept?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ id, type, name, placeholder, required, value, onchange, oninput, disabled, max, min = 1, accept }, ref) => {
        return (
            <input
                id={id}
                ref={ref}
                type={type}
                name={name}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onchange}
                disabled={disabled}
                max={max}
                min={min}
                accept={accept}
                onInput={oninput}
            />
        )
    }
)