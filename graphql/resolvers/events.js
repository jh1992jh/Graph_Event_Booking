const Event = require("../../models/Event");
const { transformEvent } = require("./merge");

const User = require("../../models/User");

const eventValidation = require("../../validation/event");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      //.populate("user")

      // The reason why you have to map is that it returns the docs from mongoDB which is a nested object with a lot of metadata etc... map is used for just getting the events without the meta data from ._doc but you can get the properties even without the ._doc but then the event also contains metadata
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  getEvent: async args => {
    const event = await Event.findById(args.eventId);

    return transformEvent(event);
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Login the create an event");
    }

    const {
      title,
      description,
      price,
      date,
      eventImg,
      eventLocation
    } = args.eventInput;

    eventValidation(
      title,
      description,

      date,
      eventImg,
      eventLocation
    );

    const event = new Event({
      title: title,
      description: description,
      price: +price,
      date: date,
      eventImg: eventImg,
      eventLocation: eventLocation,
      user: req.userId
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const user = await User.findById(req.userId);

      if (!user) {
        throw new Error("User not found");
      }

      user.createdEvents.push(event);
      await user.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
    //return event;
  },
  commentEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Login to post a comment");
    }

    const event = await Event.findById(args.eventId);

    const newComment = {
      text: args.text,
      user: req.userId,
      date: args.date
    };

    event.comments.unshift(newComment);

    await event.save();

    return event;
  }
};
