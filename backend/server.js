const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const stickyRoutes = require("./routes/stickyRoutes");
const aiRoutes = require("./routes/aiRoutes");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

connectDB();

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://task-manager-rozlyn.vercel.app",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : [])
].map(url => url.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/tasks", taskRoutes);
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/sticky", stickyRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});