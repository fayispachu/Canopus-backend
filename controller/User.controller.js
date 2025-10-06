import User from "../models/User.model.js";
import bcrypt from "bcrypt";

// REGISTER USER
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, image, notifications } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "Staff",
      image: image || "",
      notifications: notifications || { email: true, whatsapp: true },
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        bookings: newUser.bookings,
        notifications: newUser.notifications,
      },
    });
    console.log(newUser, "registered");
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bookings: user.bookings,
        notifications: user.notifications,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET SINGLE USER
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE USER PROFILE
export const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADD BOOKING
export const addBooking = async (req, res) => {
  const { userId } = req.params;
  const { event, place, phone, date, guests, items } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.bookings.push({ event, place, phone, date, guests, items });
    console.log(user.bookings, "booking");
    console.log(user);

    await user.save();

    res.status(201).json({ message: "Booking added", bookings: user.bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateBooking = async (req, res) => {
  const { id, bookingId } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const booking = user.bookings.id(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    Object.assign(booking, req.body); // update fields
    await user.save();

    res.json({ bookings: user.bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBooking = async (req, res) => {
  const { userId, bookingId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const booking = user.bookings.id(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.remove();
    await user.save();

    res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ UPDATE NOTIFICATION PREFERENCES
export const updateNotifications = async (req, res) => {
  try {
    const { email, whatsapp } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { notifications: { email, whatsapp } } },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Notifications updated",
      notifications: user.notifications,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
