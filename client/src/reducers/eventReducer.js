import { GET_EVENTS, GET_EVENT, CLEAR_EVENT, ADD_COMMENT } from "./types";

export default function eventReducer(state, action) {
  switch (action.type) {
    case GET_EVENTS:
      return {
        ...state,
        events: action.payload
      };
    case GET_EVENT:
      return {
        ...state,
        event: action.payload
      };
    case CLEAR_EVENT:
      return {
        ...state,
        event: null
      };
    case ADD_COMMENT:
      return {
        ...state,
        event: {
          ...state.event,
          comments: state.event.comments.concat(action.payload)
        }
      };
    default:
      return {
        ...state
      };
  }
}
