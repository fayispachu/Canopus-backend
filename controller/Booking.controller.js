import Booking from "../models/Booking.model.js";
import User from "../models/User.model.js";

// =============================
// 🟢 CREATE BOOKING
// =============================
export const createBooking = async (req, res) => {
  try {
    const {
      customerId,
      event,
      place,
      phone,
      date,
      guests,
      items,
      serviceType,
    } = req.body;

    if (!customerId || !event || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(customerId);
    if (!user) return res.status(404).json({ message: "Customer not found" });

    const newBooking = new Booking({
      customer: customerId,
      event,
      place,
      phone,
      date,
      guests,
      items,
      serviceType,
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================
// 🟡 GET ALL BOOKINGS
// =============================
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email role")
      .populate("assignedStaff", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// 🔵 GET BOOKINGS BY USER
// =============================
export const getUserBookings = async (req, res) => {
  try {
    const { id } = req.params;

    const bookings = await Booking.find({ customer: id })
      .populate("assignedStaff", "name email role")
      .populate("customer", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// 🟣 UPDATE BOOKING
// =============================
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("assignedStaff", "name email role")
      .populate("customer", "name email role");

    if (!updatedBooking)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// 🔴 DELETE BOOKING
// =============================
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// ⚪ REQUEST BOOKING CANCELLATION (Customer)
// =============================
export const requestCancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "cancelled" || booking.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel this booking" });
    }
    if (booking.cancelRequest) {
      return res
        .status(400)
        .json({ message: "Cancel request already pending" });
    }

    booking.cancelRequest = true;
    await booking.save();

    res.json({
      success: true,
      message: "Cancel request submitted",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// ⚫ HANDLE CANCEL APPROVAL (Admin)
// =============================
export const handleCancelBooking = async (req, res) => {
  const { id } = req.params;
  const { approve } = req.body;

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (!booking.cancelRequest) {
      return res.status(400).json({ message: "No cancel request pending" });
    }

    if (approve) {
      booking.status = "cancelled";
      booking.cancelRequest = false;
    } else {
      booking.cancelRequest = false;
    }

    await booking.save();

    res.json({
      success: true,
      message: approve
        ? "Booking cancelled successfully"
        : "Cancel request rejected",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
