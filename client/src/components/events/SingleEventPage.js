import React, { Component } from "react";
import CommentModal from "../modal/CommentModal";
import AuthContext from "../../context/auth-context";
import BookEvent from "../bookings/BookEvent";
import Loading from "../common/Loading";
import placeholder from "../common/placeholder.png";

class SingleEventPage extends Component {
  state = {
    event: null,
    showModal: false,
    commentText: ""
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchEvent();
  }

  async fetchEvent() {
    try {
      const reqBody = {
        query: `
                query GetEvent($eventId: ID!){
                    getEvent(eventId: $eventId) {
                        _id
                        title
                        price
                        date
                        description
                        eventImg
                        eventLocation
                        user {
                        _id
                        username
                        }
                        comments {
                        _id
                        text
                        user {
                            _id
                            username
                            profilePic
                        }
                     }
                    }
                }
            `,
        variables: {
          eventId: this.props.match.params.eventId
        }
      };

      const event = await fetch(process.env.REACT_APP_API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const parsedEvent = await event.json();
      const finalResponse = parsedEvent.data.getEvent;
      this.setState({ event: finalResponse });
      return finalResponse;
    } catch (err) {
      console.log(err);
    }
  }

  async postComment() {
    const { event, commentText } = this.state;
    const token = this.context.token;

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
        eventId: event._id,
        text: commentText,
        date: new Date().toISOString()
      }
    };

    console.log(token);
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
      const finalResponse = parsedComment.data.commentEvent;
      this.fetchEvent();
      this.setState({ commentText: "" });
      return finalResponse;
    } catch (err) {
      console.log(err);
    }
  }

  toggleModal = () => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  };

  commentInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const { event, showModal, commentText } = this.state;
    return event !== null ? (
      <div className="single-event-page">
        <section className="pic-and-title">
          <div className="img-wrapper">
            <img
              src={event.eventImg}
              onError={e => {
                e.target.onerror = null;
                e.target.src = placeholder;
              }}
              alt="event"
              className="event-img"
            />
          </div>
          <h3 className="event-title">{event.title}</h3>
        </section>
        <section className="event-info">
          <ul>
            <li>
              <span>Host: </span>
              <br />
              {event.user.username}
            </li>
            <li>
              <span>Entry Fee: </span>
              <br />
              {event.price}€
            </li>
            <li>
              <span>Date: </span>
              <br />
              {new Date(event.date).toLocaleDateString()}
            </li>
            <li>
              <span>Location: </span>
              <br />
              {event.eventLocation}
            </li>
            <li>
              <span>Description: </span>
              <br />
              {event.description}
            </li>
            <li>
              <div className="comments">
                <span>{event.comments.length} comments</span>
                {showModal && (
                  <CommentModal
                    toggleModal={this.toggleModal}
                    comments={event.comments}
                    commentInputChange={this.commentInputChange}
                    commentText={commentText}
                    postComment={this.postComment.bind(this)}
                  />
                )}
                <div className="btns">
                <button onClick={this.toggleModal}>View Comments</button>
                {this.context.token && <BookEvent eventId={event._id} />}
                </div>
              </div>
            </li>
          </ul>
        </section>
      </div>
    ) : (
      <Loading />
    );
  }
}

export default SingleEventPage;
