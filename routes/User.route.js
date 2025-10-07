import express from "express";
import {
  createUser,
  loginUser,
  getUser,
  updateUser,
  updateNotifications,
  getAllUsers,
} from "../controller/User.controller.js";
import { authorize, protect } from "../middleware/AuthMiddleWare.js";

const UserRouter = express.Router();

// Public routes
UserRouter.post("/register", createUser);
UserRouter.post("/login", loginUser);

// Protected routes
UserRouter.use(protect);

UserRouter.get("/profile/:id", getUser);
UserRouter.put("/profile/:id", updateUser);
UserRouter.put("/profile/:id/notifications", updateNotifications);

// Admin-only
UserRouter.get("/users", authorize("admin", "manager"), getAllUsers);

export default UserRouter;
