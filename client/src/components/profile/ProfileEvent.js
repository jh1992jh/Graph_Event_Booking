import React from "react";
import { Link } from "react-router-dom";

const ProfileEvent = ({ eventImg, title, eventLocation, eventId }) => (
  <div className="profile-event">
    <Link to={`/event/${eventId}`}>
      <div className="profile-event-img">
        <img src={eventImg} alt="Event" />
      </div>
      <div className="profile-event-info">
        <h4>{title}</h4>
        <p>{eventLocation}</p>
      </div>
    </Link>
  </div>
);

export default ProfileEvent;
