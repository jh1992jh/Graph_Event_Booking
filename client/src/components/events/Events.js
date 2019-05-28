import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../../context/event-context";
import EventList from "./EventList";
import SearchEvents from "./SearchEvents";
import NextEvent from "./NextEvent";
import Loading from "../common/Loading";
import { GET_EVENTS } from "../../reducers/types";

const Events = () => {
  const [eventCtx, dispatch] = useContext(EventContext);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchEvents] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [filteredEvents, setFilteredEvents] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const reqBody = {
          query: `
          query {
              events {
                  _id
                  title
                  description
                  eventLocation
                  eventImg
                  price
                  date
                  user {
                    _id
                    username
                    email
                  }
              }
          }
          
        `
        };

        const events = await fetch(process.env.REACT_APP_API_ENDPOINT, {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (events.status !== 200 && events.status !== 201) {
          throw new Error("Fething of the events failed, try again.");
        }

        const parsedEvents = await events.json();

        let eventsArr = [];
        parsedEvents.data.events.forEach(event => {
          if (event.date > new Date().toISOString()) {
            eventsArr.push(event);
          }
        });
        await dispatch({ type: GET_EVENTS, payload: eventsArr });

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, [dispatch]);

  let displayEvents;

  if (eventCtx.events.length > 0 && !loading) {
    displayEvents = (
      <EventList
        events={filteredEvents.length > 0 ? filteredEvents : eventCtx.events}
      />
    );
  } else if (eventCtx.events.length === 0 && loading) {
    displayEvents = <Loading />;
  } else if (eventCtx.events.length === 0 && !loading) {
    displayEvents = <p>There are no upcoming events at the moment.</p>;
  }
  return (
    <div className="events">
      <SearchEvents
        searchInput={searchInput}
        searchBy={searchBy}
        setSearchEvents={setSearchEvents}
        setSearchBy={setSearchBy}
        events={eventCtx.events}
        setFilteredEvents={setFilteredEvents}
      />
      <div className="displayed-events">
        <section className="events-section">{displayEvents}</section>
        {eventCtx.events.length !== 0 && <NextEvent events={eventCtx.events} />}
      </div>
    </div>
  );
};

export default Events;
