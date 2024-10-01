interface AlertProps {
    type: 'danger' | 'success' | 'warning' | 'info' | 'secondary';
    message: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
    return (
        <div aria-live="polite" className={`alert ${type}`}>
            {message}
        </div>
    );
};