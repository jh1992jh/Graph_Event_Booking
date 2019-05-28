import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import format from "date-fns/format";

const Success = ({
  title,
  eventLocation,
  date,
  action,
  setShowSuccess,
  redirectOnSuccess,
  history
}) => {
  useEffect(() => {
    const successTimeout = setTimeout(() => {
      setShowSuccess(false);
      if (redirectOnSuccess) {
        history.push("/events");
      }
    }, 3000);
    return () => {
      clearTimeout(successTimeout);
    };
  }, [history, redirectOnSuccess, setShowSuccess]);
  return (
    <div className="success">
      <h4>
        <i className="far fa-calendar-check" /> Event {title !== null && title}{" "}
        Successfully
        {" " + action}!
      </h4>
      <p>{eventLocation !== null && eventLocation}</p>
      <p>{date !== null && format(date, "Do MMM YYYY")}</p>
    </div>
  );
};

export default withRouter(Success);
