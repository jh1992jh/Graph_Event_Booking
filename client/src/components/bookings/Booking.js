import React from "react";

const Booking = ({ title, date, bookingId, cancelBooking }) => {
  return (
    <div className="booking">
      <li>
        {title} - {new Date(date).toLocaleDateString()}
      </li>
      <button onClick={() => cancelBooking(bookingId)}>Cancel Booking</button>
    </div>
  );
};

export default Booking;
