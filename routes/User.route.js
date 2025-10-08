import express from "express";
import {
  createUser,
  loginUser,
  getUser,
  updateUser,
  updateNotifications,
  getAllUsers,
  getSomeUser,
  registerUser,
} from "../controller/User.controller.js";
import { authorize, protect } from "../middleware/authMiddlewares.js";

const UserRouter = express.Router();

// Public routes
UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);

UserRouter.post("/register/create", createUser);

// Protected routes
UserRouter.use(protect);

UserRouter.get("/profile/:id", getUser);
UserRouter.put("/profile/:id", updateUser);
UserRouter.put("/profile/:id/notifications", updateNotifications);

// Admin-only
UserRouter.get("/users/some", authorize("admin", "manager"), getSomeUser);
UserRouter.get("/users", authorize("admin", "manager"), getAllUsers);

export default UserRouter;
