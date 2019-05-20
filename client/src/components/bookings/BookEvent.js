import React, { Component } from "react";
import AuthContext from "../../context/auth-context";

class BookEvent extends Component {
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
      console.log(finalResult);
      return finalResult;
    } catch (err) {
      throw err;
    }
  }

  render() {
    const { eventId } = this.props;
    return (
      <button onClick={this.bookEventFun.bind(this, eventId)}>
        Book Event
      </button>
    );
  }
}

export default BookEvent;
