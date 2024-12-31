const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Active", "Completed"],
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  votes: {
    for: {
      type: Number,
      default: 0
    },
    against: {
      type: Number,
      default: 0
    },
    abstain: {
      type: Number,
      default: 0
    }
  }
});

const Proposal = mongoose.model("Proposal", proposalSchema);

module.exports = Proposal;
