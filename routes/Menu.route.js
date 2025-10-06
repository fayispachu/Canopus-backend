import express from "express";
import {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "../controller/Menu.controller.js";

const MenuRouter = express.Router();

// RESTful paths
MenuRouter.get("/", getMenuItems); // GET /api/menu
MenuRouter.post("/", createMenuItem); // POST /api/menu
MenuRouter.get("/:id", getMenuItemById); // GET /api/menu/:id
MenuRouter.put("/:id", updateMenuItem); // PUT /api/menu/:id
MenuRouter.delete("/:id", deleteMenuItem); // DELETE /api/menu/:id

export default MenuRouter;
