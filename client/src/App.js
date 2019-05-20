import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import AuthContext from "./context/auth-context";

import AppContainer from "./components/common/AppContainer";
import Landing from "./components/landing/Landing";
import Auth from "./components/auth/Auth";
import Events from "./components/events/Events";
import Navbar from "./components/navbar/Navbar";
import SingleEventPage from "./components/events/SingleEventPage";
import Profile from "./components/profile/Profile";
import CreateEvent from "./components/events/CreateEvent";

class App extends Component {
  state = {
    token: null,
    userId: null,
    username: null
  };

  static contextType = AuthContext;

  async componentDidMount() {
    if (this.context.token) {
      const { token, userId, username } = this.context;
      this.setState({ token, userId, username });
    }
  }
  login = (token, userId, tokenExp, username) => {
    this.setState({ token, userId, username });
    this.context.token = token;
    this.context.userId = userId;
    this.context.username = username;
  };

  logout = () => {
    this.setState({ token: null, userId: null, username: null });
    localStorage.removeItem("evauthToken");
    this.context.token = null;
    this.context.userId = null;
    this.context.username = null;
    window.location.href = "/";
  };

  render() {
    const { token, userId, username } = this.state;
    return (
      <Router>
        <AuthContext.Provider
          value={{
            token,
            userId,
            username,

            logout: this.logout,
            login: this.login
          }}
        >
          {userId && <Navbar />}
          <AppContainer>
            <Route exact path="/" component={Landing} />
            <Route exact path="/create-event" component={CreateEvent} />
            <Route path="/auth" component={Auth} />
            <Route exact path="/event/:eventId" component={SingleEventPage} />
            <Route path="/events" component={Events} />
            <Route exact path="/profile/:profileId" component={Profile} />
          </AppContainer>
        </AuthContext.Provider>
      </Router>
    );
  }
}

export default App;
