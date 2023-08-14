const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const { PORT, MONGO_URI } = require("./src/config/config");

const corsOption = {
  origin: "*",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection error", error);
  });

// Import router
const eventRoutes = require("./src/routes/event.routes");
app.use("/event", eventRoutes);

// send back a 404 error for any unknown api request
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `${req.method} - ${req.protocol}://${req.hostname}${
      req.hostname == "localhost" ? `:${PORT}` : ""
    }${req.originalUrl} - Route not found!`,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
