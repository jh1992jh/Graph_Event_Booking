import React from "react";
import { Link } from "react-router-dom";
import avatar from "../common/avatar.png";

const Comment = ({ text, profilePic, username, userId }) => (
  <div className="comment">
    <div className="profile-info">
      <Link to={`/profile/${userId}`}>
        <img
          src={profilePic ? profilePic : avatar}
          className="profile-thumbnail"
          alt="profile"
        />
        <span className="profile-username">{username}</span>
      </Link>
    </div>
    <div className="comment-text">
      <p>{text}</p>
    </div>
  </div>
);

export default Comment;
