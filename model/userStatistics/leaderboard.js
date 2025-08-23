const mongoose = require("mongoose");

const RankingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
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
