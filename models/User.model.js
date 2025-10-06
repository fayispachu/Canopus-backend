import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "staff", "customer"],
      default: "customer",
    },
    attendance: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: "",
    },

    // Bookings / Events
    bookings: [
      {
        event: { type: String, required: true },
        place: { type: String, default: "" },
        phone: { type: String, default: "" },
        date: { type: Date, required: true },
        guests: { type: Number, default: 0 },
        items: [
          {
            name: String,
            desc: String,
          },
        ],
      },
    ],

    //  Optional Notification Preferences
    notifications: {
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
