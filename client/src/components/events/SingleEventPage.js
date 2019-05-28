import React, { useEffect, useState, useContext } from "react";
import CommentModal from "../modal/CommentModal";

import BookEvent from "../bookings/BookEvent";
import Loading from "../common/Loading";
import placeholder from "../common/placeholder.png";
import { EventContext } from "../../context/event-context";
import { GET_EVENT, CLEAR_EVENT } from "../../reducers/types";

const SingleEventPage = props => {
  const [eventCtx, dispatch] = useContext(EventContext);
  const [loading, setLoading] = useState(false);
  const [showModal, toggleModal] = useState(false);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const reqBody = {
          query: `
                query GetEvent($eventId: ID!){
                    getEvent(eventId: $eventId) {
                        _id
                        title
                        price
                        date
                        description
                        eventImg
                        eventLocation
                        user {
                        _id
                        username
                        }
                        comments {
                        _id
                        text
                        user {
                            _id
                            username
                            profilePic
                        }
                     }
                    }
                }
            `,
          variables: {
            eventId: props.match.params.eventId
          }
        };

        const event = await fetch(process.env.REACT_APP_API_ENDPOINT, {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers: {
            "Content-Type": "application/json"
          }
        });

        const parsedEvent = await event.json();
        const finalResponse = parsedEvent.data.getEvent;

        dispatch({ type: GET_EVENT, payload: finalResponse });
        setLoading(false);
        return finalResponse;
      } catch (err) {
        console.log(err);
      }
    };
    fetchEvent();

    return () => {
      dispatch({ type: CLEAR_EVENT });
    };
  }, [dispatch, props.match.params.eventId]);

  return eventCtx.event !== null && !loading ? (
    <div className="single-event-page">
      <section className="pic-and-title">
        <div className="img-wrapper">
          <img
            src={eventCtx.event.eventImg}
            onError={e => {
              e.target.onerror = null;
              e.target.src = placeholder;
            }}
            alt="event"
            className="event-img"
          />
        </div>
        <h3 className="event-title">{eventCtx.event.title}</h3>
      </section>
      <section className="event-info">
        <ul>
          <li>
            <span>Host: </span>
            <br />
            {eventCtx.event.user.username}
          </li>
          <li>
            <span>Entry Fee: </span>
            <br />
            {eventCtx.event.price}€
          </li>
          <li>
            <span>Date: </span>
            <br />
            {new Date(eventCtx.event.date).toLocaleDateString()}
          </li>
          <li>
            <span>Location: </span>
            <br />
            {eventCtx.event.eventLocation}
          </li>
          <li>
            <span>Description: </span>
            <br />
            {eventCtx.event.description}
          </li>
          <li>
            <div className="comments">
              <span>{eventCtx.event.comments.length} comments</span>
              {showModal && (
                <CommentModal
                  toggleModal={toggleModal}
                  comments={eventCtx.event.comments}
                  eventId={eventCtx.event._id}
                />
              )}

              <div className="btns">
                <button onClick={() => toggleModal(true)}>View Comments</button>
                <BookEvent event={eventCtx.event._id} />
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  ) : (
    <Loading />
  );
};

export default SingleEventPage;
