interface InputProps {
    type: string
    name?: string
    placeholder?: string
    required?: boolean
}

export const Input: React.FC<InputProps> = ({ type, name, placeholder, required }) => {
    return (
        <input type={type} name={name} placeholder={placeholder} required={required}/>
    );
};