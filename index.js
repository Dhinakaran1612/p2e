const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://0.0.0.0:27017/calendar", {
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
      req.hostname == "localhost" ? `:${port}` : ""
    }${req.originalUrl} - Route not found!`,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
