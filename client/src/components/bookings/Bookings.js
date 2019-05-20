import React, { Component } from "react";
import AuthContext from "../../context/auth-context";
import BookingList from "./BookingList";

class Bookings extends Component {
  state = {
    loading: false,
    bookings: []
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    const token = this.context.token;
    this.setState({ loading: true });
    const reqBody = {
      query: `
      query {
          bookings {
             _id
             createdAt
             event {
               _id
               title
               date
             }
             user {
               _id
             }
          }
      }
      
    `
    };

    fetch(process.env.REACT_APP_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Fething of the bookings failed, try again.");
        }

        return res.json();
      })
      .then(resData => {
        this.setState({ bookings: resData.data.bookings, loading: false });
      })
      .catch(err => this.setState({ loading: false }));
  };

  cancelBooking = bookingId => {
    const token = this.context.token;
    const { bookings } = this.state;
    const reqBody = {
      query: `
              mutation CancelBooking($id: ID!){
                  cancelBooking (bookingId: $id) {
                          _id
                          title
                  }
              }
              
            `,
      variables: {
        id: bookingId
      }
    };

    fetch(process.env.REACT_APP_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Canceling a booking failed, try again.");
        }

        return res.json();
      })
      .then(resData => {
        console.log(resData.data);
        const updatedBookings = bookings.filter(
          booking => booking._id !== bookingId
        );
        this.setState({ bookings: updatedBookings });
      })
      .catch(err => console.log(err));
  };
  render() {
    const { loading, bookings } = this.state;
    const authUser = this.context.userId;
    let displayBookings;

    if (loading) {
      displayBookings = <p>Loading</p>;
    } else if (!loading && bookings.length > 0) {
      const ownedBookings = bookings.filter(
        booking => booking.user._id === authUser
      );
      displayBookings = (
        <BookingList
          bookings={ownedBookings}
          authUser={authUser}
          cancelBooking={this.cancelBooking}
        />
      );
    } else if (!loading && bookings.length === 0) {
      displayBookings = <p>There are no Bookings</p>;
    }
    return <div className="bookings">{displayBookings}</div>;
  }
}

export default Bookings;
