import Booking from "../models/Booking.model.js";
import User from "../models/User.model.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { customerId, event, place, phone, date, guests, items } = req.body;

    // Validate customer
    const user = await User.findById(customerId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newBooking = new Booking({
      customer: customerId,
      event,
      place,
      phone,
      date,
      guests,
      items,
    });
    console.log(newBooking, "newBooking");

    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email role")
      .populate("assignedStaff", "name email role");

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get bookings of a specific user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.params.id })
      .populate("assignedStaff", "name email role")
      .populate("customer", "name email role");

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a booking
export const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("assignedStaff", "name email role")
      .populate("customer", "name email role");

    if (!updatedBooking)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/booking.controller.js

// Request cancel
export const requestCancelBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only allow if not already cancelled or completed
    if (booking.status === "cancelled" || booking.status === "done") {
      return res.status(400).json({ message: "Cannot cancel this booking" });
    }

    booking.cancelRequest = true;
    await booking.save();
    console.log(booking, "booking cancell ");

    res.json({ success: true, booking, message: "Cancel request submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin approves or rejects cancel
export const handleCancelBooking = async (req, res) => {
  const { id } = req.params;
  const { approve } = req.body; // true = approve, false = reject

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (!booking.cancelRequest) {
      return res.status(400).json({ message: "No cancel request pending" });
    }

    if (approve) {
      booking.status = "cancelled"; // mark as cancelled
      booking.cancelRequest = false;
    } else {
      booking.cancelRequest = false; // reject request
    }
    console.log(booking, "booking after approve/reject");

    await booking.save();
    res.json({
      success: true,
      booking,
      message: approve ? "Booking cancelled" : "Cancel request rejected",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
