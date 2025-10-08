import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // Linked user (customer)
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic booking info
    event: { type: String, required: true, trim: true },
    place: { type: String, default: "", trim: true },
    phone: { type: String, default: null, trim: true },
    date: { type: Date, required: true },
    guests: { type: Number, default: 0, min: 0 },

    // Items booked (e.g. equipment, menu items, etc.)
    items: [
      {
        name: { type: String, trim: true },
        desc: { type: String, trim: true },
      },
    ],

    // Staff assigned to this booking (multiple possible)
    assignedStaff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Booking status flow
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },

    // Cancellation logic
    cancelRequest: { type: Boolean, default: false },

    // Optional service type (rent / catering / other)
    serviceType: {
      type: String,
      enum: ["rent", "service", "event", "other"],
      default: "rent",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Optional: Virtual populate (for quick user lookup)
bookingSchema.virtual("customerInfo", {
  ref: "User",
  localField: "customer",
  foreignField: "_id",
  justOne: true,
});

// Optional pre-save validation or formatting
bookingSchema.pre("save", function (next) {
  if (this.phone && !/^\+?[0-9]{7,15}$/.test(this.phone)) {
    return next(new Error("Invalid phone number format"));
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
