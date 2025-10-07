import express from "express";
import {
  createWork,
  deleteWork,
  getAllWorks,
  updateWork,
} from "../controller/Work.controller.js";

const WorkRouter = express.Router();

// CRUD for Work
WorkRouter.post("/", createWork); // Create work
WorkRouter.get("/", getAllWorks); // Get all works
WorkRouter.put("/:id", updateWork); // Update work
WorkRouter.delete("/:id", deleteWork); // Delete work

export default WorkRouter;
