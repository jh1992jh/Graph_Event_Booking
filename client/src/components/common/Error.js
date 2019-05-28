import React, { useEffect } from "react";

const Success = ({ error, setErrors }) => {
  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      setErrors(false);
    }, 3000);
    return () => {
      clearTimeout(errorTimeout);
    };
  }, [setErrors]);
  return (
    <div className="error">
      <h4>
        <i className="fas fa-exclamation-triangle" /> {error}
      </h4>
    </div>
  );
};

export default Success;
