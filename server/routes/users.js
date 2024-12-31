const express = require("express");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { User } = require("../models/user");
const { auth, isUser, isAdmin } = require("../middleware/auth");

const router = express.Router();

// GET ALL USERS
router.get("/", isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });

    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE USER
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    res.status(200).send(deletedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET USER BY ID
router.get("/find/:id", isUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// UPDATE USER
router.put("/:id", isUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.email !== req.body.email) {
      const emailInUse = await User.findOne({ email: req.body.email });
      if (emailInUse) {
        return res.status(400).send("That email is already taken");
      }
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      user.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        password: user.password
      },
      { new: true }
    );

    res.status(200).send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET USER STATS
router.get("/stats", isAdmin, async (req, res) => {
  const previousMonth = moment().subtract(1, "month").startOf("month");

  try {
    const users = await User.aggregate([
      {
        $match: { createdAt: { $gte: previousMonth.toDate() } }
      },
      {
        $project: {
          month: { $month: "$createdAt" }
        }
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 }
        }
      }
    ]);

    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
