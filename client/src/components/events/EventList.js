import React from "react";
import Event from "./Event";

const EventList = ({ events, authUser }) => {
  return (
    <ul className="event-list">
      {events.map(event => (
        <Event
          key={event._id}
          title={event.title}
          date={event.date}
          eventImg={event.eventImg}
          eventLocation={event.eventLocation}
          eventId={event._id}
        />
      ))}
    </ul>
  );
};

export default EventList;
