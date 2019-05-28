const Booking = require("../../models/Booking");
const Event = require("../../models/Event");
const User = require("../../models/User");

const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Login to see bookings");
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Login to book an event");
    }

    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent
    });
    const result = await booking.save();
    const user = await User.findById(req.userId);
    await user.bookedEvents.push(transformBooking(result));
    await user.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Login to cancel a booking");
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      const user = await User.findById(req.userId);
      const eventIndex = await user.bookedEvents.indexOf(args.bookingId);
      user.bookedEvents.splice(eventIndex, 1);
      await user.save();
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};
