import React from "react";
import ProfileEvent from "../profile/ProfileEvent";

const ProfileEventsModal = ({ events, title, toggleModal }) => {
  events.forEach(event => {
    console.log(event.date);
  });
  return (
    <div className="modal-background">
      <div className="modal">
        <header className="modal-header">
          <h3>{title} Events</h3>
          <span className="close-modal" onClick={() => toggleModal(null)}>
            X
          </span>
        </header>
        <section className="modal-events">
          {events.length === 0 ? (
            <p>{`User has no ${title.toLowerCase()} events yet`}</p>
          ) : (
            events.map(event => (
              <ProfileEvent
                key={event._id}
                eventId={event._id}
                title={event.title}
                eventLocation={event.eventLocation}
                eventImg={event.eventImg}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfileEventsModal;
