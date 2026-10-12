require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const rideRoutes = require("./routes/rides");
const bookingRoutes = require("./routes/bookings");
const safetyRoutes = require("./routes/safety");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/safety", safetyRoutes);

// Check MongoDB configuration
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing from the .env file.");
  process.exit(1);
}

// Database + Server
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("\n❌ MongoDB connection failed!");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error details:", err);

    process.exit(1);
  });
