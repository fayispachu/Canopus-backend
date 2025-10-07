import express from "express";

import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getUserBookings,
  handleCancelBooking,
  requestCancelBooking,
  updateBooking,
} from "../controller/Booking.controller.js";
import { protect } from "../middleware/AuthMiddleware.js";

const BookingRouter = express.Router();

// Create a new booking
BookingRouter.post("/", protect, createBooking);

// Get all bookings (admin only)
BookingRouter.get("/", protect, getAllBookings);

// Get bookings of a specific user
BookingRouter.get("/user/:id", protect, getUserBookings);

// Update a booking
BookingRouter.put("/:id", protect, updateBooking);

// Delete a booking
BookingRouter.delete("/:id", protect, deleteBooking);
BookingRouter.patch("/cancel-request/:id", requestCancelBooking);

// Admin/Manager approves or rejects cancel
BookingRouter.put("/cancel/:id", handleCancelBooking);
export default BookingRouter;
