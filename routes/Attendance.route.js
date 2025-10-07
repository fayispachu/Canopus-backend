import express from "express";
import {
  getAllAttendance,
  getAttendanceByUser,
  markAttendance,
} from "../controller/Attendance.controller.js";

const AttendanceRouter = express.Router();

// Attendance
AttendanceRouter.post("/:userId", markAttendance);
AttendanceRouter.get("/user/:userId", getAttendanceByUser);
AttendanceRouter.get("/", getAllAttendance);

export default AttendanceRouter;
