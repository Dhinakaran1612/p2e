const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(path.normalize(path.join(__dirname, "../..")), `.env`),
});

const { PORT, MONGO_URI, STARTHOURS, ENDHOURS, DURATION, TIMEZONE } =
  process.env;

module.exports = {
  PORT,
  MONGO_URI,
  STARTHOURS,
  ENDHOURS,
  DURATION,
  TIMEZONE,
};
