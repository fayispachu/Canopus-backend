import express from "express";
import {
  addGalleryImage,
  deleteGalleryImage,
  getGalleryImages,
} from "../controller/Gallery.controller.js";

const GalleryRouter = express.Router();

GalleryRouter.post("/", addGalleryImage);
GalleryRouter.get("/", getGalleryImages);
GalleryRouter.delete("/:id", deleteGalleryImage);

export default GalleryRouter;
