const Badge = require("../../../model/badgeModel/userBadge");
const User = require("../../../model/userModel/userModel");


const handleCreateBadge = async (req, res) => {
  try {
    const { name, description, milestoneDays, iconUrl } = req.body;

    const badge = await Badge.create({ name, description, milestoneDays, iconUrl });
    res.status(201).json({ success: true, badge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleUpdateBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const badge = await Badge.findByIdAndUpdate(id, req.body, { new: true });
    if (!badge) return res.status(404).json({ success: false, message: "Badge not found" });
    res.json({ success: true, badge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleDeleteBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const badge = await Badge.findByIdAndDelete(id);
    if (!badge) return res.status(404).json({ success: false, message: "Badge not found" });
    res.json({ success: true, message: "Badge deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const handleGetUserBadges = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("earnedBadges");

    res.json({ success: true, badges: user.earnedBadges || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  handleCreateBadge,
  handleUpdateBadge,
  handleDeleteBadge,
  handleGetUserBadges
}
