import React from "react";
import Booking from "./Booking";

const BookingList = ({ bookings, cancelBooking }) => {
  return (
    <ul className="booking-list">
      {bookings.map(booking => (
        <Booking
          key={booking._id}
          title={booking.event.title}
          date={booking.event.date}
          bookingId={booking._id}
          cancelBooking={cancelBooking}
        />
      ))}
    </ul>
  );
};

export default BookingList;
