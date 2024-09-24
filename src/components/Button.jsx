// eslint-disable-next-line react/prop-types
export const Button = ({ text, onClick, icon, className  }) => {
  return (
    <button className={`login-button ${className}`} onClick={onClick}>
      {icon && <i className="material-symbols-rounded">{icon}</i>} {/* Display icon if provided */}
      {text}
    </button>
  );
};
