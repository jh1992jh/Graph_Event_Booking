import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const NextEvent = ({ events }) => {
  events.sort((date1, date2) => {
    return new Date(date1.date) - new Date(date2.date);
  });

  const event = events[0];
  return (
    <div className="next-event">
      <div className="next-event-wrapper">
        <header className="next-event-header">
          <h2>Next Event</h2>
        </header>
        {event ? (
          <Fragment>
            <div className="img-wrapper">
              <img
                src={event.eventImg}
                alt="Next event"
                className="next-event-thumb"
              />
            </div>
            <h3>{event.title}</h3>
            <Link to={`/event/${event._id}`}>
              <button>More Details</button>
            </Link>
          </Fragment>
        ) : null}
      </div>
    </div>
  );
};

export default NextEvent;
