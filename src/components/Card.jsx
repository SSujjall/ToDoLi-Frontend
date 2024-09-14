/* eslint-disable react/prop-types */
export const Card = ({ icon, title, value }) => {
  return (
    <div className="card">
      <div className="card-main">
        <i className="material-symbols-rounded">{icon}</i>
        <h4>{title}</h4>
      </div>
      <p>{value}</p>
    </div>
  );
};
