import { LegacyRef } from "react"

interface InputProps {
    id?: string
    type: string
    name?: string
    placeholder?: string
    required?: boolean
    value?: string
    onchange?: any
    disabled?: boolean
    ref?: LegacyRef<any>
}

export const Input: React.FC<InputProps> = ({ id, ref, type, name, placeholder, required, value, onchange, disabled }) => {
    return (
        <input id={id} ref={ref} type={type} name={name} placeholder={placeholder} required={required} value={value} onChange={onchange} disabled={disabled}/>
    );
};