import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import format from "date-fns/format";
import placeholder from "../common/placeholder.png";

const Event = ({ title, date, eventId, eventImg, eventLocation }) => {
  return (
    <Fragment>
      <li className="event">
        <header className="event-header">
          <h3>{title}</h3>
        </header>
        <div className="event-body">
          <div className="img-wrapper">
            <img
              src={eventImg}
              onError={e => {
                e.target.onerror = null;
                e.target.src = placeholder;
              }}
              alt="event"
            />
          </div>
          <div className="event-info">
            <h4>{eventLocation}</h4>
            <h4>{format(date, "Do MMM YYYY")}</h4>
            <Link to={`/event/${eventId}`}>
              <button>View event</button>
            </Link>
          </div>
        </div>
      </li>
    </Fragment>
  );
};

export default Event;
