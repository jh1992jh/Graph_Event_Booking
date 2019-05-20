import React from "react";
import Comment from "../comment/Comment";

const CommentModal = ({
  toggleModal,
  commentInputChange,
  postComment,
  comments,
  commentText
}) => (
  <div className="modal-background">
    <div className="modal">
      <header className="modal-header">
        <h3>Comments</h3>
        <span className="close-modal" onClick={() => toggleModal()}>
          X
        </span>
      </header>
      <section className="modal-comments">
        <div>
          {comments.length === 0 ? (
            <li>This event has no comments yet</li>
          ) : (
            comments.map(comment => (
              <Comment
                key={comment._id}
                text={comment.text}
                profilePic={comment.user.profilePic}
                username={comment.user.username}
                userId={comment.user._id}
              />
            ))
          )}
        </div>
      </section>
      <section className="modal-actions">
        <input
          type="text"
          name="commentText"
          value={commentText}
          onChange={e => commentInputChange(e)}
        />
        <button onClick={() => postComment()}>Submit</button>
      </section>
    </div>
  </div>
);

export default CommentModal;
