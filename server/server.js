const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRouts");
const blogRoutes = require("./routes/blogRoutses");
const gameRoutes = require("./routes/gameRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const messageRoutes = require("./routes/messageRoutes");
const errorHandler = require("./middleware/errorHandler");

require("./config/passport");

const app = express();
const fs = require("fs");
const uploadDir = path.join(__dirname, "Uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ✅ MongoDB connect
connectDB();

// ✅ CORS fix (localhost + vercel)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://clutch-coins-front.vercel.app"   // apna frontend vercel domain
  ],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use(passport.initialize());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);

// Error handler
app.use(errorHandler);

// ✅ Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://clutch-coins-front.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
});
app.set("io", io);
require("./socket/chatSocket")(io);

// ✅ Port binding for Render
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
