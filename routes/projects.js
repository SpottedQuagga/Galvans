import express from "express";
import mongoose from "mongoose";
import Project from "../models/Project.js";

const router = express.Router();

// ✅ Create Project
router.post("/", async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || !members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: "Project name and members are required" });
    }

    // Convert all member.userId to ObjectId
    const formattedMembers = members.map(member => ({
      userId: new mongoose.Types.ObjectId(member.userId),
      role: member.role || "member"
    }));

    const project = new Project({
      name,
      members: formattedMembers,
      tasks: [],
      messages: []
    });

    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Project Create Error:", error);
    res.status(500).json({ message: "Failed to create project", error: error.message });
  }
});

// ✅ Get all projects for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const projects = await Project.find({ "members.userId": userId })
      .populate("members.userId", "username email");

    // Return empty array if no projects
    res.json(projects || []);
  } catch (error) {
    console.error("Fetch Projects Error:", error);
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
});

// ✅ Add task to project
router.post("/:projectId/tasks", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, status } = req.body;

    if (!title) return res.status(400).json({ message: "Task title is required" });

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndUpdate(
      new mongoose.Types.ObjectId(projectId),
      { $push: { tasks: { title, status: status || "pending" } } },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Task added successfully", project });
  } catch (error) {
    console.error("Add Task Error:", error);
    res.status(500).json({ message: "Failed to add task", error: error.message });
  }
});

export default router;
