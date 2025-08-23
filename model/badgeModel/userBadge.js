const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  milestoneDays: {
    type: Number,
    required: true,
  },
  icon: { type: String },
});

module.exports = mongoose.model("Badge", badgeSchema);
