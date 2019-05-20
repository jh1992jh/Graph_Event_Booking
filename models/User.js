const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = {
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String
  },
  bio: {
    type: String
  },
  joined: {
    type: Date,
    default: Date.now
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event"
    }
  ],
  bookedEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking"
    }
  ]
};

module.exports = mongoose.model("User", userSchema);
