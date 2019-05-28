import React, { useState, useContext } from "react";
import avatar from "../common/avatar.png";
import { EDIT_PROFILE } from "../../reducers/types";
import { UserContext } from "../../context/user-context";

const EditProfileModal = ({ bio, profilePic, toggleModal }) => {
  const [userCtx, dispatch] = useContext(UserContext);
  const [bioInput, setBioInput] = useState(bio);
  const [profilePicInput, setProfilePicInput] = useState(profilePic);

  const editProfile = async () => {
    try {
      const token = localStorage.evauthToken;
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

      const editedProfileFields = {
        bio: parsedProfile.data.editProfile.bio,
        profilePic: parsedProfile.data.editProfile.profilePic
      };

      dispatch({ type: EDIT_PROFILE, payload: editedProfileFields });
      return editedProfileFields;
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="modal-background">
      <div className="modal">
        <header className="modal-header">
          <h3>Edit Profile</h3>
          <span className="close-modal" onClick={() => toggleModal(null)}>
            X
          </span>
        </header>
        <section className="modal-content">
          <img
            src={profilePicInput}
            onError={e => {
              e.target.onerror = null;
              e.target.src = avatar;
            }}
            alt="?"
          />
          <form>
            <input
              type="text"
              name="profilePicInput"
              id="profilePicInput"
              value={profilePicInput}
              onChange={e => setProfilePicInput(e.target.value)}
            />
            <textarea
              name="bioInput"
              id="bioInput"
              value={bioInput}
              onChange={e => setBioInput(e.target.value)}
              cols="30"
              rows="4"
            />
          </form>
        </section>

        <section className="modal-actions">
          <button id="edit-profile-btn" onClick={() => editProfile()}>
            Submit
          </button>
        </section>
      </div>
    </div>
  );
};

export default EditProfileModal;
