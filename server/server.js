const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const session = require("express-session"); // Added express-session

const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const connectDB = require("./config/db");
const blogRoutes = require('./routes/blogRoutses');
const adminRoutes = require('./routes/adminRouts');
const packageRoutes = require('./routes/packages');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cartRoutes = require("./routes/cartRoutes");
const errorHandler = require("./middleware/errorHandler");
const heroTrendingRoutes = require("./routes/heroTrendingRoutes");

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

// ✅ Add express-session middleware before passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" } // Secure cookies in production
  })
);

app.use(passport.initialize());
app.use(passport.session()); // Add passport.session() for session support

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/featured", heroTrendingRoutes);
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