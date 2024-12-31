const express = require("express");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const { Proposal } = require("../models/proposal");
const router = express.Router();

// Create a new proposal
router.post("/", auth, async (req, res) => {
  try {
    const newProposal = new Proposal({
      ...req.body,
      creator: req.user._id
    });
    const savedProposal = await newProposal.save();
    res.status(201).json(savedProposal);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all proposals
router.get("/", auth, async (req, res) => {
  try {
    const proposals = await Proposal.find().populate("creator", "name");
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get proposal by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate(
      "creator",
      "name"
    );
    if (!proposal) return res.status(404).send("Proposal not found");
    res.status(200).json(proposal);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a proposal
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedProposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProposal) return res.status(404).send("Proposal not found");
    res.status(200).json(updatedProposal);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a proposal
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedProposal = await Proposal.findByIdAndDelete(req.params.id);
    if (!deletedProposal) return res.status(404).send("Proposal not found");
    res.status(200).json(deletedProposal);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
