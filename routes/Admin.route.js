import express from "express";
import { adminLogin } from "../controller/Admin.Controller.js";
import { verifyAdminToken } from "../middleware/adminAuth.js";

const AdminRouter = express.Router();

AdminRouter.post("/login", adminLogin);

// Example protected route
AdminRouter.get("/dashboard", verifyAdminToken, (req, res) => {
  res.json({ message: `Welcome ${req.admin.name}!` });
});

export default AdminRouter;
