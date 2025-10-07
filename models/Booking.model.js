import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: { type: String, required: true },
    place: { type: String, default: "" },
    phone: { type: String, default: null },
    date: { type: Date, required: true },
    guests: { type: Number, default: 0 },
    assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    items: [
      {
        name: { type: String },
        desc: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    cancelRequest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
