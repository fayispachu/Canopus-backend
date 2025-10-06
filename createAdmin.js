import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.model.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createAdmin() {
  const admin = new User({
    name: "Fayiz Pachu",
    email: "fayizpachu217@gmail.com",
    password: "pachuadaaa",
    role: "admin",
  });

  await admin.save();
  console.log("Admin created:", admin);
  mongoose.disconnect();
}

createAdmin();
