import React, { useState, useContext } from "react";
import Comment from "../comment/Comment";
import { EventContext } from "../../context/event-context";
import { ADD_COMMENT } from "../../reducers/types";
import { UserContext } from "../../context/user-context";

const CommentModal = ({ toggleModal, comments, eventId }) => {
  const [eventCtx, dispatch] = useContext(EventContext);
  const userCtx = useContext(UserContext);
  const [commentText, setCommentText] = useState("");

  const postComment = async () => {
    const token = localStorage.evauthToken;

    const reqBody = {
      query: `
        mutation CommentEvent($eventId: ID!, $text: String!, $date: String!) {
          commentEvent(eventId: $eventId, text: $text, date: $date) {
            _id
            comments {
              _id
              text
              
            }
          }
        }
      `,
      variables: {
        eventId: eventId,
        text: commentText,
        date: new Date().toISOString()
      }
    };

    try {
      const comment = await fetch(process.env.REACT_APP_API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });

      const parsedComment = await comment.json();

      const newComment = {
        _id: parsedComment.data.commentEvent._id,
        text: commentText,
        user: {
          profilePic: userCtx[0].user.profilePic,
          username: userCtx[0].user.username,
          userId: userCtx[0].user._id
        }
      };

      dispatch({ type: ADD_COMMENT, payload: newComment });
      setCommentText("");
      return;
    } catch (err) {
      console.log(err);
    }
  };

  const isDisabled = commentText.trim().length === 0;
  return (
    <div className="modal-background">
      <div className="modal">
        <header className="modal-header">
          <h3>Comments</h3>
          <span className="close-modal" onClick={() => toggleModal(false)}>
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
            onChange={e => setCommentText(e.target.value)}
          />
          <button disabled={isDisabled} onClick={() => postComment()}>
            Submit
          </button>
        </section>
      </div>
    </div>
  );
};

export default CommentModal;
