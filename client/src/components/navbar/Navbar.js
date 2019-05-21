import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";

import AuthContext from "../../context/auth-context";

import avatar from "../common/avatar.png";
import desktopLogo from "../common/desktop_logo.png";
import mobileLogo from "../common/mobile_logo.png";

class Navbar extends Component {
  state = {
    userId: null,
    username: null,
    profilePic: null
  };

  static contextType = AuthContext;

  async componentDidMount() {
    try {
      const token = this.context.token;

      const reqBody = {
        query: `
          query GetAuthUser {
            getAuthUser {
              _id
              username
              profilePic
            }
          }
        `
      };

      const authUser = await fetch(process.env.REACT_APP_API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-type": "application/json",
          Authorization: token
        }
      });

      const parsedAuthUser = await authUser.json();

      const { _id, username, profilePic } = parsedAuthUser.data.getAuthUser;

      const finalResponse = parsedAuthUser.data.getAuthUser;

      this.setState({ userId: _id, username, profilePic });
      return finalResponse;
    } catch (err) {
      throw err;
    }
  }

  render() {
    const { userId, username, profilePic } = this.state;
    return userId !== null && username !== null ? (
      <nav>
        <div className="logo-wrapper">
          <NavLink to="/">
            <img src={desktopLogo} id="desktop-logo" alt="Graph Event" />
            <img src={mobileLogo} id="mobile-logo" alt="Graph Event" />
          </NavLink>
        </div>

        <div className="nav-links">
          <ul>
            <li id="events-link">
              <NavLink to="/events">
                <i className="fas fa-calendar-week" />
                Events
              </NavLink>
            </li>
            <li id="create-link">
              <Link to="/create-event">
                <i className="fas fa-map-marked-alt" />
                Create <span className="hide-on-mobile">Event</span>
              </Link>
            </li>

            <li id="profile-link">
              <Link to={`/profile/${userId}`}>
                <div className="profile-thumbnail-wrapper">
                  <img src={profilePic ? profilePic : avatar} alt="profile" />
                </div>
                <h3>{username}</h3>
              </Link>
            </li>

            <li id="logout">
              <button onClick={this.context.logout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>
    ) : null;
  }
}

export default Navbar;
