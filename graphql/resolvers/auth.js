const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Event = require("../../models/Event");
const Booking = require("../../models/Booking");

// const findBookings = require("./merge");
const { transformEvent } = require("./merge");

const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });

      if (existingUser) {
        throw new Error("User exists already");
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        username: args.userInput.username,
        password: hashedPassword,
        profilePic: args.userInput.profilePic,
        bio: args.userInput.bio
      });

      const result = await user.save();

      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User does not exist");
    }

    const passMatch = await bcrypt.compare(password, user.password);

    if (!passMatch) {
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h"
      }
    );

    return {
      userId: user.id,
      token: token,
      tokenExp: 1,
      username: user.username
    };
  },
  getUser: async (args, req) => {
    const user = await User.findById(args.userId);
    const bookedIds = user.bookedEvents.map(booking => booking._id);
    const eventIds = user.createdEvents.map(event => event._id);

    const createdEventsTransformed = await Event.find({
      _id: { $in: eventIds }
    }).populate("event");

    createdEventsProcessed = createdEventsTransformed.map(event => {
      return { ...event._doc, date: new Date(event.date).toISOString() };
    });

    const bookedEventsTransformed = await Booking.find({
      _id: { $in: bookedIds }
    }).populate("event");

    return {
      ...user._doc,
      password: null,
      joined: new Date(user._doc.joined).toISOString(),
      bookedEvents: bookedEventsTransformed,
      createdEvents: createdEventsProcessed
    };
  },
  getAuthUser: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthorized");
    }
    const user = await User.findById(req.userId);
    const bookedIds = user.bookedEvents.map(booking => booking._id);

    const bookedEventsTransformed = await Booking.find({
      _id: { $in: bookedIds }
    }).populate("event");

    return {
      ...user._doc,
      password: null,
      bookedEvents: bookedEventsTransformed
    };
  },
  editProfile: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Login to edit a profile");
    }

    const profileFields = {};
    profileFields.bio = args.bio;
    profileFields.profilePic = args.profilePic;
    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      { $set: profileFields },
      { new: true }
    );

    return user;
  }
};
