const router = require("express").Router();
const {
  createEvent,
  freeSlots,
  getEvents,
} = require("../controllers/event.controller");

router.post("/create-event", createEvent);
router.get("/get-events", getEvents);
router.get("/free-slots", freeSlots);

module.exports = router;
