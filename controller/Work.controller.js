import mongoose from "mongoose";
import Work from "../models/Work.model.js";
import User from "../models/User.model.js";
import sendEmail from "../utils/sendMail.js";

// ✅ CREATE WORK
export const createWork = async (req, res) => {
  try {
    const { title, description, assignedTo, createdBy, dueDate } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    // Ensure assignedTo is an array of ObjectId
    const assignedArray = (
      Array.isArray(assignedTo) ? assignedTo : [assignedTo]
    )
      .filter(Boolean)
      .map((id) => new mongoose.Types.ObjectId(id));

    const newWork = new Work({
      title,
      description,
      assignedTo: assignedArray,
      createdBy,
      dueDate,
    });
    await newWork.save();

    // Push work to assigned staff and send email notifications
    if (assignedArray.length > 0) {
      await User.updateMany(
        { _id: { $in: assignedArray } },
        { $push: { assignedWorks: newWork._id } }
      );

      const assignedUsers = await User.find({ _id: { $in: assignedArray } });
      assignedUsers.forEach((user) => {
        if (user.email) {
          const subject = `New Work Assigned: ${title}`;
          const text = `Hi ${user.name},\n\nYou have been assigned a new work.\n\nPlease confirm if you are ready to work.\n\nThanks.`;
          sendEmail(user.email, subject, text).catch((err) => {
            console.error(`Failed to send email to ${user.email}:`, err);
          });
        }
      });
    }

    res
      .status(201)
      .json({ message: "Work created and notifications sent", work: newWork });
  } catch (err) {
    console.error("Create Work Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL WORKS
export const getAllWorks = async (req, res) => {
  try {
    const works = await Work.find()
      .populate("assignedTo", "name role profilePic email")
      .populate("createdBy", "name role");
    res.status(200).json(works);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE WORK
export const updateWork = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.assignedTo) {
      req.body.assignedTo = (
        Array.isArray(req.body.assignedTo)
          ? req.body.assignedTo
          : [req.body.assignedTo]
      )
        .filter(Boolean)
        .map((id) => new mongoose.Types.ObjectId(id));
    }

    const updatedWork = await Work.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("assignedTo", "name role profilePic email")
      .populate("createdBy", "name role");

    if (!updatedWork)
      return res.status(404).json({ message: "Work not found" });

    res.json({ message: "Work updated", work: updatedWork });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE WORK
export const deleteWork = async (req, res) => {
  const { id } = req.params;
  try {
    const work = await Work.findByIdAndDelete(id);
    if (!work) return res.status(404).json({ message: "Work not found" });

    await User.updateMany(
      { assignedWorks: work._id },
      { $pull: { assignedWorks: work._id } }
    );

    res.json({ message: "Work deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ MARK USER STATUS (ready / leave / pending)
export const markUserStatus = async (req, res) => {
  const { workId } = req.params;
  const { userId, status } = req.body;

  if (!["ready", "leave", "pending"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  try {
    const work = await Work.findById(workId);
    if (!work) return res.status(404).json({ message: "Work not found" });

    const index = work.assignedUsersStatus.findIndex(
      (u) => u.user.toString() === userId
    );
    if (index === -1)
      return res
        .status(400)
        .json({ message: "User not assigned to this work" });

    work.assignedUsersStatus[index].status = status;
    await work.save();

    res.status(200).json({ message: "Status updated", work });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET WORK WITH USER STATUS
export const getWorkWithStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const work = await Work.findById(id)
      .populate("assignedTo", "name profilePic role email")
      .populate("createdBy", "name role");

    if (!work) return res.status(404).json({ message: "Work not found" });

    res.status(200).json(work);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
