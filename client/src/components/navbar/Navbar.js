import React, { useContext, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

import { UserContext } from "../../context/user-context";
import { GET_AUTH_USER, LOGOUT } from "../../reducers/types";

import avatar from "../common/avatar.png";
import desktopLogo from "../common/desktop_logo.png";
import mobileLogo from "../common/mobile_logo.png";

const Navbar = () => {
  const [userCtx, dispatch] = useContext(UserContext);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = localStorage.evauthToken;

        const reqBody = {
          query: `
            query GetAuthUser {
              getAuthUser {
                _id
                username
                profilePic
                bio
                joined
                createdEvents{
                  _id
                  
                }
                bookedEvents{
                  _id
                  event{_id}
                }
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

        const finalResponse = parsedAuthUser.data.getAuthUser;
        const {
          _id,
          username,
          profilePic,
          bio,
          joined,
          createdEvents,
          bookedEvents
        } = finalResponse;

        const loggedInUser = {
          _id,
          username,
          profilePic,
          bio,
          joined,
          createdEvents,
          bookedEvents
        };
        dispatch({ type: GET_AUTH_USER, payload: loggedInUser });

        return finalResponse;
      } catch (err) {
        throw err;
      }
    };
    getCurrentUser();
  }, [dispatch]);

  return (
    userCtx.user !== null && (
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
              <Link to={`/profile/${userCtx.user._id}`}>
                <div className="profile-thumbnail-wrapper">
                  <img
                    src={
                      userCtx.user.profilePic ? userCtx.user.profilePic : avatar
                    }
                    alt="profile"
                  />
                </div>
                <h3>{userCtx.user.username}</h3>
              </Link>
            </li>

            <li id="logout">
              <button onClick={() => dispatch({ type: LOGOUT })}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>
    )
  );
};

export default Navbar;
