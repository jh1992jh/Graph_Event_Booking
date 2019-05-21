import React, { Component, Fragment } from "react";
import AuthContext from "../../context/auth-context";

import Success from "../common/Success";

class BookEvent extends Component {
  state = {
    showSuccess: false,
    timerId: null
  };
  static contextType = AuthContext;

  async bookEventFun(eventId) {
    try {
      const token = this.context.token;
      const reqBody = {
        query: `
                mutation BookEvent($eventId: ID!){
                    bookEvent(eventId: $eventId) {
                        _id
                        createdAt
                        updatedAt
                    }
                }
              `,
        variables: {
          eventId
        }
      };

      const booking = await fetch(process.env.REACT_APP_API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });
      const parsedBooking = await booking.json();

      const finalResult = parsedBooking.data.bookEvent;
      this.setState({ showSuccess: true });
      const successTimeout = setTimeout(
        () => this.setState({ showSuccess: false }),
        3000
      );
      this.setState({ timerId: successTimeout });
      return finalResult;
    } catch (err) {
      throw err;
    }
  }

  componentWillUnmount() {
    const { timerId } = this.state;
    clearTimeout(timerId);
    this.setState({ timerId: null });
  }

  render() {
    const { eventId } = this.props;
    const { showSuccess } = this.state;
    return (
      <Fragment>
        <button onClick={this.bookEventFun.bind(this, eventId)}>
          Book Event
        </button>
        {showSuccess && (
          <Success
            action="Booked"
            title={null}
            eventLocation={null}
            date={null}
          />
        )}
      </Fragment>
    );
  }
}

export default BookEvent;
