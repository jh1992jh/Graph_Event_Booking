import {
  LOGIN,
  LOGOUT,
  GET_AUTH_USER,
  GET_CURRENT_PROFILE,
  EDIT_PROFILE,
  CLEAR_CURRENT_PROFILE
} from "./types";

export default function userReducer(state, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        auth: action.payload,
        isAuth: true
      };
    case GET_AUTH_USER:
      return {
        ...state,
        user: action.payload
      };
    case GET_CURRENT_PROFILE:
      return {
        ...state,
        currentProfile: action.payload
      };
    case EDIT_PROFILE:
      return {
        ...state,
        currentProfile: {
          ...state.currentProfile,
          bio: action.payload.bio,
          profilePic: action.payload.profilePic
        }
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        currentProfile: null
      };
    case LOGOUT:
      localStorage.removeItem("evauthToken");
      setTimeout(() => (window.location.href = "/"), 100);
      return {
        auth: null,
        isAuth: false,
        user: null
      };
    default:
      return { ...state };
  }
}
