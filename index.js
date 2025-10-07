import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./database/DBConnection.js";
import UserRouter from "./routes/User.route.js";
import GalleryRouter from "./routes/Gallery.route.js";
import MenuRouter from "./routes/Menu.route.js";
import AttendanceRouter from "./routes/Attendance.route.js";
import BookingRouter from "./routes/Booking.route.js";
import WorkRouter from "./routes/Work.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Needed for ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: [
      "https://canopus-frontend.onrender.com", // your client URL
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Connect to database
connectDB();

// API routes
app.use("/api/user", UserRouter);
app.use("/api/menu", MenuRouter);
app.use("/api/gallery", GalleryRouter);
app.use("/api/attendance", AttendanceRouter);
app.use("/api/booking", BookingRouter);
app.use("/api/work", WorkRouter);

// Serve React client build
app.use(express.static(path.join(__dirname, "client/dist")));

// Catch-all route for React Router (works in Express 5+)
app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
