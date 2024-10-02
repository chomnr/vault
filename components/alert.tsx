interface AlertProps {
    type: 'danger' | 'success' | 'warning' | 'info' | 'secondary'
    message: string
    code: string
}

export const Alert: React.FC<AlertProps> = ({ type, message, code }) => {
    return (
        <div aria-live="polite" className={`alert ${type}`}>
            <span className="code">{code}</span>
            {message}
        </div>
    );
};