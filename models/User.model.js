import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["admin", "manager", "staff", "customer"],
      default: "staff",
    },
    profilePic: { type: String, default: "" },

    // Staff-specific
    assignedWorks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Work" }],

    // Notification preferences
    notifications: {
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
