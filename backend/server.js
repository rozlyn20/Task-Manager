const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const aiRoutes = require("./routes/aiRoutes");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

connectDB();

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/tasks", taskRoutes);
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});