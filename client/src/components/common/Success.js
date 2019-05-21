import React from "react";
import format from "date-fns/format";

const Success = ({ title, eventLocation, date, action }) => (
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

export default Success;
