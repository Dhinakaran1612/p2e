const mongoose = require("mongoose");

const Event = mongoose.model("Event", {
  dateTime: Date,
  duration: Number,
});

module.exports = Event;
