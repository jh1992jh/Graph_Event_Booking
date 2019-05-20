import React from "react";
import format from "date-fns/format";

const Success = ({ title, eventLocation, date }) => (
  <div className="success">
    <h4>
      <i className="far fa-calendar-check" /> Event {title} Successfully
      Created!
    </h4>
    <p>{eventLocation}</p>
    <p>{format(date, "Do MMM YYYY")}</p>
  </div>
);

export default Success;
