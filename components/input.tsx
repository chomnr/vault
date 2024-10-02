interface InputProps {
    type: string
    name?: string
    placeholder?: string
    required?: boolean
    value?: string
    onchange?: any
}

export const Input: React.FC<InputProps> = ({ type, name, placeholder, required, value, onchange }) => {
    return (
        <input type={type} name={name} placeholder={placeholder} required={required} value={value} onChange={onchange}/>
    );
};