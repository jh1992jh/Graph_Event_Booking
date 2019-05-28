import React, { useReducer, createContext } from "react";

import eventReducer from "../reducers/eventReducer";

export const EventContext = createContext();

const initialEventState = {
  events: [],
  event: null
};

export const EventProvider = props => {
  const [eventState, dispatch] = useReducer(eventReducer, initialEventState);
  return (
    <EventContext.Provider value={[eventState, dispatch]}>
      {props.children}
    </EventContext.Provider>
  );
};
