const mongoose = require("mongoose");

const RankingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  flameScore: {
     type: Number, 
     default: 0 
    },
  rank: {
     type: Number,
      default: 0 
    }, 
}, { timestamps: true });

module.exports = mongoose.model("Ranking", RankingSchema);
