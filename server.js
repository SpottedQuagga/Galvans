import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect DB and start server
connectDB().then(() => {
  console.log("DB connected. Starting routes...");

  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);

  app.get("/", (req, res) => res.send("SynergySphere Backend Running!"));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
