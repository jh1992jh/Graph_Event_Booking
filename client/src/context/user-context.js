import React, { useReducer, createContext } from "react";
import userReducer from "../reducers/userReducer";

export const UserContext = createContext();

const initialUserState = {
  auth: null,
  isAuth: false,
  user: null,
  currentProfile: null
};

export const UserProvider = props => {
  const [userState, dispatch] = useReducer(userReducer, initialUserState);
  return (
    <UserContext.Provider value={[userState, dispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};
