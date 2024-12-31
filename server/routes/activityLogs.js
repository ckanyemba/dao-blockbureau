const express = require("express");
const ActivityLog = require("../models/ActivityLog");
const { auth } = require("../middleware/auth");
const router = express.Router();

// Log an activity
router.post("/", auth, async (req, res) => {
  try {
    const newActivity = new ActivityLog({
      ...req.body,
      user: req.user._id
    });
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all activity logs
router.get("/", auth, async (req, res) => {
  try {
    const activities = await ActivityLog.find().populate("user", "name");
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
