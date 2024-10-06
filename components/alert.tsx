
interface AlertProps {
    type: 'danger' | 'success' | 'warning' | 'info' | 'secondary';
    message: string;
    code: string;
    onClick?: () => void;
}


export const Alert: React.FC<AlertProps> = ({ type, message, code, onClick }) => {
    return (
        <div
            aria-live="polite"
            className={`alert ${type}`}
            onClick={onClick}
            style={{ cursor: "pointer" }}
        >
            <span className="code">{code}</span>
            {message}
        </div>
    );
};