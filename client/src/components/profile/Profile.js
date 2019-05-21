import React, { Component, Fragment } from "react";
import format from "date-fns/format";
import AuthContext from "../../context/auth-context";
import avatar from "../common/avatar.png";
import Loading from "../common/Loading";
import EditProfileModal from "../modal/EditProfileModal";
import ProfileEventsModal from "../modal/ProfileEventsModal";

class Profile extends Component {
  state = {
    username: "",
    bio: "",
    bioInput: "",
    joined: "",
    profilePic: "",
    profilePicInput: "",
    bookedEvents: [],
    createdEvents: [],
    showModal: null
  };

  /* TODO: WRITE COMPONENTWILLRECIEVEPROPS method that compares the current profileId at the url to the one in the state, if they do not match that means it's a different profile so fetch profile info for the new profile and set it to state */

  static contextType = AuthContext;
  async componentDidMount() {
    this.fetchProfile();
  }

  async fetchProfile() {
    try {
      const token = this.context.token;
      const reqBody = {
        query: `
                query GetUser($userId: ID!){
                    getUser(userId: $userId) {
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
          userId: this.props.match.params.profileId
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

      this.setState({
        username: finalResponse.username,
        bio: finalResponse.bio,
        bioInput: finalResponse.bio,
        joined: finalResponse.joined,
        profilePic:
          finalResponse.profilePic !== null ? finalResponse.profilePic : avatar,
        profilePicInput:
          finalResponse.profilePic !== null ? finalResponse.profilePic : avatar,
        createdEvents: finalResponse.createdEvents,
        bookedEvents: transformedBookings
      });

      return finalResponse;
    } catch (err) {
      console.log(err);
    }
  }

  async editProfile() {
    try {
      const { bioInput, profilePicInput } = this.state;
      const token = this.context.token;
      const reqBody = {
        query: `
        mutation EditProfile($bio: String!, $profilePic: String!) {
          editProfile(bio: $bio, profilePic: $profilePic) {
            username
            bio
            profilePic
            joined
          }
        }
      `,
        variables: {
          bio: bioInput,
          profilePic: profilePicInput
        }
      };

      const profile = await fetch(process.env.REACT_APP_API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });

      const parsedProfile = await profile.json();
      console.log(parsedProfile.data);
      const editedProfile = parsedProfile.data.editProfile;
      console.log(editedProfile);
      this.setState({
        bio: editedProfile.bio,
        profilePic: editedProfile.profilePic
      });
      return editedProfile;
    } catch (err) {
      throw err;
    }
  }

  toggleModal = val => {
    this.setState({ showModal: val });
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const {
      username,
      bio,
      bioInput,
      joined,
      profilePic,
      profilePicInput,
      showModal,
      bookedEvents,
      createdEvents
    } = this.state;
    const authUser = this.context.userId;
    const currentProfile = this.props.match.params.profileId;
    const isLoaded =
      username.length !== 0 ||
      bio.length !== 0 ||
      joined.length !== 0 ||
      profilePic.length !== 0;
    return (
      <div className="profile">
        {isLoaded ? (
          <Fragment>
            <section className="profile-pic-username">
              <img src={profilePic ? profilePic : avatar} alt="profile" />
              <h1>{username}</h1>
            </section>
            <section className="profile-info">
              <div className="profile-info-bio">
                <div className="bio-and-joined">
                  <h3>Joined: </h3>
                  <p>{format(joined, "Do MMM YYYY")}</p>
                  <h3>Bio:</h3>

                  <p>
                    {bio
                      ? bio
                      : "The User has not written a bio for themselves yet."}
                  </p>
                </div>
              </div>
              <div className="events">
                <button onClick={() => this.toggleModal("booked")}>
                  {bookedEvents.length} | Booked
                </button>
                {showModal === "booked" && (
                  <ProfileEventsModal
                    title="Booked"
                    toggleModal={this.toggleModal}
                    events={bookedEvents}
                  />
                )}
                <button onClick={() => this.toggleModal("created")}>
                  {createdEvents.length} | Created
                </button>
                {showModal === "created" && (
                  <ProfileEventsModal
                    title="Created"
                    toggleModal={this.toggleModal}
                    events={createdEvents}
                  />
                )}
                {authUser === currentProfile && (
                  <button onClick={() => this.toggleModal("edit")}>
                    Edit Profile
                  </button>
                )}
                {showModal === "edit" && (
                  <EditProfileModal
                    bioInput={bioInput}
                    profilePicInput={profilePicInput}
                    onInputChange={this.onInputChange}
                    editProfile={this.editProfile.bind(this)}
                    toggleModal={this.toggleModal}
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
  }
}

export default Profile;
