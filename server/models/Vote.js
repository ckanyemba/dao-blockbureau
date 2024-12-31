const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
    required: true
  },
  voter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  vote: {
    type: String,
    enum: ["For", "Against", "Abstain"],
    required: true
  },
  reason: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;
