// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/DBConnection.js";
import UserRouter from "./routes/User.route.js";
import GalleryRouter from "./routes/Gallery.route.js";
import MenuRouter from "./routes/Menu.route.js";
import AttendanceRouter from "./routes/Attendance.route.js";
import BookingRouter from "./routes/Booking.route.js";
import Work from "./models/Work.model.js";
import WorkRouter from "./routes/Work.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: ["https://canopus-frontend-beta.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

connectDB();

app.use("/api/user", UserRouter);
app.use("/api/menu", MenuRouter);

app.use("/api/gallery", GalleryRouter);
app.use("/api/attendance", AttendanceRouter);
app.use("/api/booking", BookingRouter);
app.use("/api/work", WorkRouter);
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
