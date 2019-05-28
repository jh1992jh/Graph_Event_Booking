import React, { useContext, useEffect, useState, Fragment } from "react";
import format from "date-fns/format";
import avatar from "../common/avatar.png";
import Loading from "../common/Loading";
import EditProfileModal from "../modal/EditProfileModal";
import ProfileEventsModal from "../modal/ProfileEventsModal";
import { UserContext } from "../../context/user-context";
import {
  GET_CURRENT_PROFILE,
  CLEAR_CURRENT_PROFILE
} from "../../reducers/types";

const Profile = ({ match }) => {
  const [userCtx, dispatch] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState("");
  /* TODO: WRITE COMPONENTWILLRECIEVEPROPS method that compares the current profileId at the url to the one in the state, if they do not match that means it's a different profile so fetch profile info for the new profile and set it to state */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.evauthToken;
        const reqBody = {
          query: `
                  query GetUser($userId: ID!){
                      getUser(userId: $userId) {
                          _id
                          username
                          bio
                          profilePic
                          joined
                          bookedEvents {
                            event {
                              _id
                              title
                              eventImg
                              eventLocation
                            }
                          }
                          createdEvents {
                            _id
                            title
                            eventImg
                            eventLocation
                          }
                      }
                  }
              `,
          variables: {
            userId: match.params.profileId
          }
        };

        const user = await fetch(process.env.REACT_APP_API_ENDPOINT, {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        });

        const parsedUser = await user.json();

        const finalResponse = parsedUser.data.getUser;

        const transformedBookings = finalResponse.bookedEvents.map(
          booking => booking.event
        );

        const profile = {
          userId: finalResponse._id,
          username: finalResponse.username,
          bio: finalResponse.bio,
          joined: finalResponse.joined,
          profilePic:
            finalResponse.profilePic !== null
              ? finalResponse.profilePic
              : avatar,
          createdEvents: finalResponse.createdEvents,
          bookedEvents: transformedBookings
        };

        dispatch({ type: GET_CURRENT_PROFILE, payload: profile });
        setLoading(false);
        return finalResponse;
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();

    return () => dispatch({ type: CLEAR_CURRENT_PROFILE });
  }, [dispatch, match.params.profileId]);

  return (
    <div className="profile">
      {userCtx.currentProfile && !loading ? (
        <Fragment>
          <section className="profile-pic-username">
            <img
              src={userCtx.currentProfile.profilePic}
              onError={e => {
                e.target.onerror = null;
                e.target.src = avatar;
              }}
              alt="profile"
            />
            <h1>{userCtx.currentProfile.username}</h1>
          </section>
          <section className="profile-info">
            <div className="profile-info-bio">
              <div className="bio-and-joined">
                <h3>Joined: </h3>
                <p>{format(userCtx.currentProfile.joined, "Do MMM YYYY")}</p>
                <h3>Bio:</h3>

                <p>
                  {userCtx.currentProfile.bio
                    ? userCtx.currentProfile.bio
                    : "The User has not written a bio for themselves yet."}
                </p>
              </div>
            </div>
            <div className="events">
              <button onClick={() => setShowModal("booked")}>
                {userCtx.currentProfile.bookedEvents.length} | Booked
              </button>
              {showModal === "booked" && (
                <ProfileEventsModal
                  title="Booked"
                  toggleModal={setShowModal}
                  events={userCtx.currentProfile.bookedEvents}
                />
              )}
              <button onClick={() => setShowModal("created")}>
                {userCtx.currentProfile.createdEvents.length} | Created
              </button>
              {showModal === "created" && (
                <ProfileEventsModal
                  title="Created"
                  toggleModal={setShowModal}
                  events={userCtx.currentProfile.createdEvents}
                />
              )}
              {userCtx.auth.userId === userCtx.currentProfile.userId && (
                <button onClick={() => setShowModal("edit")}>
                  Edit Profile
                </button>
              )}
              {showModal === "edit" && (
                <EditProfileModal
                  bio={userCtx.currentProfile.bio}
                  profilePic={userCtx.currentProfile.profilePic}
                  toggleModal={setShowModal}
                />
              )}
            </div>
          </section>
        </Fragment>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Profile;
