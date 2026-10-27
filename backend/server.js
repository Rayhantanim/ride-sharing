const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Groq = require("groq-sdk");
const path = require("path");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const rideRoutes = require("./routes/rides");
const bookingRoutes = require("./routes/bookings");
const safetyRoutes = require("./routes/safety");
const driverRoutes = require("./routes/driver");
const verificationRoutes = require("./routes/verification");
const adminRoutes = require("./routes/admin");
const scheduledRideRoutes = require("./routes/scheduledRides");
const savedPlaceRoutes = require("./routes/savedPlaces");
const supportRoutes = require("./routes/support");

const ChatMessage = require("./models/ChatMessage");

const app = express();
const port = process.env.PORT || 5000;

/* ─────────────── Groq Client ─────────────── */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ─────────────── Middleware ─────────────── */
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  }),
);

// Parse JSON request bodies — must be before routes
app.use(express.json());

/* ─────────────── Main Routes ─────────────── */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/safety", safetyRoutes);
app.use("/api/driver", driverRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/verification", verificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/scheduled-rides", scheduledRideRoutes);
app.use("/api/saved-places", savedPlaceRoutes);

// Support submit, history and delete routes
app.use("/api/support", supportRoutes);

/* ═══════════════════════════════════════════
   CHAT ROUTES
   ═══════════════════════════════════════════ */

// GET /api/chat/history?userId=xxx
app.get("/api/chat/history", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    const messages = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const ordered = messages.reverse().map((m) => ({
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    }));

    res.json({ messages: ordered });
  } catch (error) {
    console.error("History error:", error.message);

    res.status(500).json({
      error: "Could not load history",
    });
  }
});

// POST /api/chat
app.post("/api/chat", async (req, res) => {
  try {
    const { userId, message } = req.body;

    console.log("📥 Chat request:", { userId, message });

    if (!userId || !message || typeof message !== "string") {
      return res.status(400).json({
        error: "userId and message are required",
      });
    }

    await ChatMessage.create({
      userId,
      role: "user",
      content: message,
    });

    const history = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const contextMessages = history.reverse().map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content:
            "You are the in-app assistant for zyGo, a ride-hailing app in Bangladesh. " +
            "Help users with ride booking, safety, payments, and app usage. " +
            "Reply in the same language the user writes (Bangla or English). " +
            "Keep answers short, friendly, and helpful.",
        },
        ...contextMessages,
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || "No response.";

    await ChatMessage.create({
      userId,
      role: "assistant",
      content: reply,
    });

    res.json({ message: reply });
  } catch (error) {
    console.error("AI Error:", error.message || error);

    res.status(500).json({
      error: "AI service unavailable. Please try again.",
    });
  }
});

// DELETE /api/chat/history?userId=xxx
app.delete("/api/chat/history", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    await ChatMessage.deleteMany({ userId });

    res.json({
      success: true,
      message: "Chat history cleared",
    });
  } catch (error) {
    console.error("Delete history error:", error.message);

    res.status(500).json({
      error: "Could not clear history",
    });
  }
});

/* ─────────────── MongoDB + Server ─────────────── */
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing from the .env file.");
  process.exit(1);
}

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
