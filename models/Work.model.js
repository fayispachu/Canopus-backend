import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    assignedTo: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // staff
        status: {
          type: String,
          enum: ["pending", "ready", "leave"], // individual status
          default: "pending",
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // who created the work
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "done"],
      default: "pending",
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Work = mongoose.model("Work", workSchema);
export default Work;
