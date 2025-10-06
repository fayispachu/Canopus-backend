import express from "express";
import {
  createUser,
  loginUser,
  getUser,
  getAllUsers,
  updateUser,

  addBooking,
  updateNotifications,
  updateBooking,
  deleteBooking,
} from "../controller/User.controller.js";

const UserRouter = express.Router();

// Auth
UserRouter.post("/register", createUser);
UserRouter.post("/login", loginUser);

// User info
UserRouter.get("/profile/:id", getUser);
UserRouter.get("/users", getAllUsers);

// Profile & Settings
UserRouter.put("/profile/:id", updateUser);
UserRouter.put("/profile/:id/notifications", updateNotifications);

UserRouter.post("/profile/:id/bookings", addBooking);
UserRouter.put("/profile/:id/bookings/:bookingId", updateBooking);

// Delete a booking
UserRouter.delete("/profile/:id/bookings/:bookingId", deleteBooking);
export default UserRouter;
