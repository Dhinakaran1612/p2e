const asyncHandler = require("express-async-handler");
const moment = require("moment-timezone");
const Event = require("../models/event.model");
const {
  STARTHOURS,
  ENDHOURS,
  DURATION,
  TIMEZONE,
} = require("../config/config");

const createEvent = asyncHandler(async (req, res) => {
  const { dateTime, duration } = req.body;

  const existingEvent = await Event.findOne({ dateTime });

  if (existingEvent) {
    return res
      .status(422)
      .json({ message: "Event already exists for this time." });
  }

  await Event.create({ dateTime, duration });

  return res
    .status(201)
    .json({ success: true, message: "Event created successfully." });
});

const getEvents = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.sendStatus(400);
  }

  const events = await Event.find({
    dateTime: { $gte: new Date(startDate), $lt: new Date(endDate) },
  });

  return res.status(200).json({ success: true, list: events });
});

const freeSlots = asyncHandler(async (req, res) => {
  const { date, timeZone = TIMEZONE } = req.query;

  const targetDate = moment.tz(date, timeZone);

  const startDate = targetDate.clone().startOf("day").hour(STARTHOURS);
  const endDate = targetDate.clone().startOf("day").hour(ENDHOURS);

  const occupiedSlots = await Event.find({
    dateTime: {
      $gte: startDate.toDate(),
      $lt: endDate.toDate(),
    },
  });

  const freeSlots = [];
  let currentSlot = startDate.clone();

  while (currentSlot.isBefore(endDate)) {
    const slotInTimezone = currentSlot.clone().tz(timeZone);

    if (
      !occupiedSlots.some((event) =>
        moment(event.dateTime).isSame(slotInTimezone)
      )
    ) {
      freeSlots.push(moment(slotInTimezone));
    }

    currentSlot.add(DURATION, "minutes");
  }

  return res.status(200).json({ success: true, list: freeSlots });
});

module.exports = {
  createEvent,
  getEvents,
  freeSlots,
};
