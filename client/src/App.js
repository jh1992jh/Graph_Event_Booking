import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import PrivateRoute from "./components/privateroute/PrivateRoute";

import { EventProvider } from "./context/event-context";

import { UserContext } from "./context/user-context";
import { LOGOUT, LOGIN } from "./reducers/types";

import AppContainer from "./components/common/AppContainer";
import Landing from "./components/landing/Landing";
import Events from "./components/events/Events";
import Navbar from "./components/navbar/Navbar";
import SingleEventPage from "./components/events/SingleEventPage";
import Profile from "./components/profile/Profile";
import CreateEvent from "./components/events/CreateEvent";

const App = () => {
  const [userCtx, dispatch] = useContext(UserContext);
  useEffect(() => {
    if (localStorage.evauthToken) {
      const decoded = jwt_decode(localStorage.evauthToken);
      const currentTime = Date.now() / 1000;
      const expires = decoded.exp;

      if (expires < currentTime) {
        localStorage.removeItem("evauthToken");
        dispatch({ type: LOGOUT });
        return;
      }

      if (!localStorage.evauthToken) {
        window.location.href = "/";
      }

      if (localStorage.evauthToken) {
        dispatch({ type: LOGIN, payload: decoded });
      }
    }
  }, [dispatch]);
  return (
    <Router>
      {localStorage.evauthToken && <Navbar />}
      <AppContainer>
        <Route exact path="/" component={Landing} />
        <EventProvider>
          <PrivateRoute exact path="/create-event" component={CreateEvent} />
          <PrivateRoute
            exact
            path="/event/:eventId"
            component={SingleEventPage}
          />
          <PrivateRoute path="/events" component={Events} />
        </EventProvider>
        <Route exact path="/profile/:profileId" component={Profile} />
      </AppContainer>
    </Router>
  );
};

export default App;
