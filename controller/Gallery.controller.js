import GalleryItem from "../models/Gallery.model.js";

// ✅ Add new image
export const addGalleryImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const newImage = await GalleryItem.create({
      image,
      createdBy: req.user?._id, // optional, if auth is enabled
    });

    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all gallery images
export const getGalleryImages = async (req, res) => {
  try {
    const images = await GalleryItem.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete gallery image
export const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await GalleryItem.findByIdAndDelete(id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
