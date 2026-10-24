const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Google DNS — fixes querySrv ECONNREFUSED

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const OpenAI = require("openai");
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

const app = express();
const port = process.env.PORT || 3000;

/* ─────────────── OpenAI Client ─────────────── */
// const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY,});
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
  })
);

app.use(express.json());

/* ─────────────── Routes ─────────────── */
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

/* ─────────────── AI Chat Route ─────────────── */
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    // Sanitize: only allow user/assistant roles, limit length
    const cleanMessages = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant"))
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));

    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   temperature: 0.7,
    //   max_tokens: 500,
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You are the in-app assistant for zyGo, a ride-hailing app in Bangladesh. " +
    //         "Help users with ride booking, safety, payments, and app usage. " +
    //         "Reply in the same language the user writes (Bangla or English). " +
    //         "Keep answers short, friendly, and helpful.",
    //     },
    //     ...cleanMessages,
    //   ],
    // });
const completion = await groq.chat.completions.create({
  // model: "llama-3.3-70b-versatile",  // অথবা "llama-3.1-8b-instant", দ্রুততর
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
    ...cleanMessages,
  ],
});

    const reply = completion.choices?.[0]?.message?.content || "No response.";
    res.json({ message: reply });
  } catch (error) {
    console.error("AI Error:", error.message || error);
    res.status(500).json({ error: "AI service unavailable. Please try again." });
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