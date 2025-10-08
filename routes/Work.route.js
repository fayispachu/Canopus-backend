import express from "express";
import {
  createWork,
  deleteWork,
  getAllWorks,
  updateWork,
  markUserStatus,
  getWorkWithStatus,
} from "../controller/Work.controller.js";

const WorkRouter = express.Router();

// CRUD for Work
WorkRouter.post("/", createWork); // Create work
WorkRouter.get("/", getAllWorks); // Get all works
WorkRouter.get("/:id", getWorkWithStatus); // Get single work with assigned user status
WorkRouter.put("/:id", updateWork); // Update work
WorkRouter.delete("/:id", deleteWork); // Delete work

// ✅ Update assigned user status
WorkRouter.put("/:workId/status", markUserStatus); // { userId, status }

export default WorkRouter;
