// eslint-disable-next-line react/prop-types
export const Button = ({ text, onClick, icon  }) => {
  return (
    <button className="login-button" onClick={onClick}>
      {icon && <i className="material-symbols-rounded">{icon}</i>} {/* Display icon if provided */}
      {text}
    </button>
  );
};
