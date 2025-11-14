const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(helmet());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// existing application routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/gov", require("./routes/governmentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));

/**
 * Robust Cohere Chat handler:
 * - uses global fetch (Node 18+/22+)
 * - timeout via AbortController
 * - retries with exponential backoff on 5xx/transient errors
 * - content-type check to avoid parsing HTML error pages
 * - short in-memory cache to reduce repeated calls
 */

// small sleep helper
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// robust fetch wrapper for Cohere Chat
async function cohereChatRequest(message, apiKey, { maxRetries = 3, timeoutMs = 10000, model = "command-a-03-2025" } = {}) {
  const url = "https://api.cohere.ai/v1/chat";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, message }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Transient server error -> throw to trigger retry
      if (resp.status >= 500 && resp.status < 600) {
        const text = await resp.text().catch(() => "");
        throw new Error(`Server error ${resp.status}: ${text.substring(0, 200)}`);
      }

      // Client error (bad request / unauthorized) -> no retry
      if (resp.status >= 400 && resp.status < 500) {
        const txt = await resp.text().catch(() => "");
        try {
          const j = JSON.parse(txt || "{}");
          throw new Error(`Cohere ${resp.status}: ${j?.message || JSON.stringify(j)}`);
        } catch {
          throw new Error(`Cohere ${resp.status}: ${txt}`);
        }
      }

      // Ensure JSON; avoid parsing HTML error pages (502 etc.)
      const ct = resp.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const raw = await resp.text().catch(() => "");
        throw new Error(`Non-JSON response from Cohere (status ${resp.status}): ${raw.substring(0, 500)}`);
      }

      const json = await resp.json();
      return json;
    } catch (err) {
      const isLast = attempt === maxRetries;
      console.warn(`Cohere attempt ${attempt} failed: ${err.message}`);
      if (isLast) throw err;
      // exponential backoff with small jitter
      const delay = 300 * Math.pow(2, attempt) + Math.floor(Math.random() * 150);
      await sleep(delay);
    }
  }
}

// small in-memory cache: message -> { reply, expires }
const aiCache = new Map();

app.post("/api/ask", async (req, res) => {
  try {
    const { message } = req.body ?? {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'message' in request body" });
    }

    // normalize cache key
    const key = message.trim().toLowerCase();
    const cached = aiCache.get(key);
    if (cached && cached.expires > Date.now()) {
      // return cached reply (fast)
      return res.json({ reply: cached.reply });
    }

    const apiKey = process.env.COHERE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "AI key not configured on server" });
    }

    // call Cohere with retries/timeouts
    const json = await cohereChatRequest(message, apiKey, { maxRetries: 3, timeoutMs: 10000, model: "command-a-03-2025" });

    // robust extraction of text-like reply (covers multiple provider shapes)
    const reply =
      json?.message?.content ||
      json?.output?.[0]?.content ||
      json?.output?.[0]?.text ||
      json?.generations?.[0]?.text ||
      json?.choices?.[0]?.message?.content ||
      json?.result?.content ||
      json?.text ||
      (typeof json === "object" ? JSON.stringify(json).slice(0, 1000) : String(json));

    // cache short-lived (30s) to reduce repeated calls for identical queries
    aiCache.set(key, { reply, expires: Date.now() + 30_000 });

    console.log("Cohere parsed reply:", reply);
    return res.json({ reply });
  } catch (err) {
    console.error("Cohere call failed:", err.message || err);
    return res.status(502).json({
      error: "AI service temporarily unavailable. Please try again in a few seconds.",
      detail: (err.message || "").slice(0, 300),
    });
  }
});

app.get("/", (req, res) => {
  res.send("🌐 Citipulse API is running securely!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
