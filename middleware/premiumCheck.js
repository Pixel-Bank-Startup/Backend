const User = require("../model/authModel/userModel");

const checkPremiumAccess = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   if (!user.hasPremiumAccess || (user.premiumEndDate && user.premiumEndDate < new Date())) {
  return res.status(403).json({ message: "Premium access expired" });
}

    next(); 
  } catch (error) {
    console.error("Premium middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkPremiumAccess;
