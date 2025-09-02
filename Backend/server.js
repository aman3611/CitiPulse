const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const { Server } = require("socket.io");
const https = require("https");

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

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/gov", require("./routes/governmentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.post("/api/ask", (req, res) => {
const { message } = req.body;

  const data = JSON.stringify({
    model: "command-r-plus",
    message: `You are CitiPulse's official assistant, trained strictly to help users understand and use the Citipulse platform.
  
  CitiPulse is a civic issue reporting platform where:
  - Citizens can report civic issues like potholes, garbage, broken streetlights etc.
  - Reports include photos, location tagging using Leaflet maps.
  - Users can track resolution progress, vote on issues, tag local leaders.
  - There are 3 roles: User (citizen), Government, Admin.
  - Dashboards are separate for each role with tools like:
    - Users: Create Post, Track Post, Edit Profile, Community Chat.
    - Government: View Posts, Update Progress, View Feedback.
    - Admin: Manage Users, Manage Government, Manage All Posts.
  
  You must:
  - **ONLY** answer questions about CitiPulse features, how to use the platform, civic engagement, or app structure.
  - If the question is about something unrelated (like celebrities, general world knowledge, coding), reply: 
    **"I'm here to help only with CitiPulse-related queries. Please ask something about the platform."**
  
  Now, here is the user question:
  "${message}"`,
  });

  const options = {
    hostname: "api.cohere.ai",
    path: "/v1/chat",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
    },
  };

  const apiReq = https.request(options, (apiRes) => {
    let responseBody = "";
    apiRes.on("data", (chunk) => (responseBody += chunk));
    apiRes.on("end", () => {
      try {
        const parsed = JSON.parse(responseBody);
        res.json({ reply: parsed.text });
      } catch {
        res.status(500).json({ error: "Invalid response from Cohere" });
      }
    });
  });

  apiReq.on("error", (err) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Request to Cohere failed" });
  });

  apiReq.write(data);
  apiReq.end();
});

app.get("/", (req, res) => {
  res.send("🌐 Citipulse API is running securely!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
