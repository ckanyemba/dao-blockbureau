const express = require("express");
const { auth } = require("../middleware/auth");
const Vote = require("../models/Vote");
const Proposal = require("../models/proposal");
const router = express.Router();

// Cast a vote
router.post("/", auth, async (req, res) => {
  try {
    const { proposalId, vote, reason } = req.body;
    const newVote = new Vote({
      proposal: proposalId,
      voter: req.user._id,
      vote,
      reason
    });
    const savedVote = await newVote.save();

    // Update proposal votes
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) return res.status(404).send("Proposal not found");
    proposal.votes[vote.toLowerCase()] += 1;
    await proposal.save();

    res.status(201).json(savedVote);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get votes by proposal ID
router.get("/:proposalId", auth, async (req, res) => {
  try {
    const votes = await Vote.find({ proposal: req.params.proposalId });
    res.status(200).json(votes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
