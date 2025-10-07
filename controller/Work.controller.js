import Work from "../models/Work.model.js";
import User from "../models/User.model.js";

// ✅ CREATE WORK
export const createWork = async (req, res) => {
  try {
    const { title, description, assignedTo, createdBy, dueDate } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const newWork = new Work({
      title,
      description,
      assignedTo,
      createdBy,
      dueDate,
    });
    await newWork.save();

    // Optionally, push work to assigned staff
    if (assignedTo && assignedTo.length > 0) {
      await User.updateMany(
        { _id: { $in: assignedTo } },
        { $push: { assignedWorks: newWork._id } }
      );
    }

    res.status(201).json({ message: "Work created", work: newWork });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL WORKS
export const getAllWorks = async (req, res) => {
  try {
    const works = await Work.find()
      .populate("assignedTo", "name role profilePic")
      .populate("createdBy", "name role");
    res.status(200).json(works);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE WORK
export const updateWork = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedWork = await Work.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("assignedTo", "name role profilePic")
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

    // Remove work from assigned staff
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
