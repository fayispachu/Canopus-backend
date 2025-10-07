import Attendance from "../models/Attendance.model.js";
import User from "../models/User.model.js";

// ✅ MARK ATTENDANCE
export const markAttendance = async (req, res) => {
  const { userId } = req.params;
  const { status, checkInTime, checkOutTime } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      user: userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!attendance) {
      attendance = new Attendance({
        user: userId,
        status,
        checkInTime,
        checkOutTime,
      });
    } else {
      attendance.status = status || attendance.status;
      attendance.checkInTime = checkInTime || attendance.checkInTime;
      attendance.checkOutTime = checkOutTime || attendance.checkOutTime;
    }

    await attendance.save();
    user.isPresent = status === "present";
    await user.save();

    res.status(200).json({ message: "Attendance updated", attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ATTENDANCE FOR A USER
export const getAttendanceByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const attendance = await Attendance.find({ user: userId }).sort({
      date: -1,
    });
    res.status(200).json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL ATTENDANCE
export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("user", "name role profilePic")
      .sort({ date: -1 });
    res.status(200).json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
