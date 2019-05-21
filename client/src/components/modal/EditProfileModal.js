import React from "react";
import avatar from "../common/avatar.png";

const EditProfileModal = ({
  bioInput,
  profilePicInput,
  toggleModal,
  onInputChange,
  editProfile
}) => (
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
            onChange={e => onInputChange(e)}
          />
          <textarea
            name="bioInput"
            id="bioInput"
            value={bioInput}
            onChange={e => onInputChange(e)}
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

export default EditProfileModal;
