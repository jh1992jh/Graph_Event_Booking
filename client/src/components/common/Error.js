import React from "react";

const Success = ({ error }) => (
  <div className="error">
    <h4>
      <i className="fas fa-exclamation-triangle" /> {error}
    </h4>
  </div>
);

export default Success;
