const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    required: true,
    default: 0.0
  },
  date: {
    type: Date,
    default: Date.now
  },
  eventLocation: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  eventImg: {
    type: String
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      text: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model("Event", EventSchema);
