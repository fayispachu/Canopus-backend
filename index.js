// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/DBConnection.js";
import UserRouter from "./routes/User.route.js";
import GalleryRouter from "./routes/Gallery.route.js";
import MenuRouter from "./routes/Menu.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", UserRouter);
app.use("/api/menu", MenuRouter);

app.use("/api/gallery", GalleryRouter);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
